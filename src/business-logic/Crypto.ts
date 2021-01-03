import { EventEmitter } from 'events';
import { ReadStream, WriteStream } from 'fs';
import { pipeline } from 'stream';

import {
  EVENT_DESTINATION_STREAM_FINISH,
  EVENT_NOTICE,
  EVENT_SOURCE_STREAM_PROGRESS,
} from '../constants';
import { getCipher, getDecipher } from './helpers/cipher';
import { compress, decompress } from './helpers/compress';
import { getFileSize } from './helpers/file-size';
import {
  getInitializationVector,
  getInitializationVectorStream,
} from './helpers/initialization-vector';
import { calculateProgress } from './helpers/progress';
import { getDestinationStream, getSourceStream } from './helpers/stream';

export interface ICrypto extends EventEmitter {
  encrypt(): void;
  decrypt(): void;
}

export default class Crypto extends EventEmitter implements ICrypto {
  private _sourceFilePath: string;
  private _destinationFilePath: string;
  private _passphrase: string;

  constructor(
    sourceFilePath: string,
    destinationFilePath: string,
    passphrase: string,
  ) {
    super();
    this._sourceFilePath = sourceFilePath;
    this._destinationFilePath = destinationFilePath;
    this._passphrase = passphrase;
  }

  encrypt(): void {
    const initializationVector = getInitializationVector();
    const initializationVectorStream = getInitializationVectorStream(
      initializationVector,
    );
    const cipher = getCipher(this._passphrase, initializationVector);
    const sourceStream = getSourceStream(this._sourceFilePath);
    const destinationStream = getDestinationStream(this._destinationFilePath);
    pipeline(
      sourceStream,
      compress(),
      cipher,
      initializationVectorStream,
      destinationStream,
      (err) => {
        if (err) {
          console.error(err);
          this.emit(EVENT_NOTICE, 'Oops! Something went wrong!');
        }
      },
    );
    this._handleSourceStream(sourceStream);
    this._handleDestinationStream(destinationStream);
  }

  decrypt(): void {
    const initializationVectorStream = getSourceStream(
      this._sourceFilePath,
      0,
      15,
    );
    const sourceStream = getSourceStream(this._sourceFilePath, 16);
    const destinationStream = getDestinationStream(this._destinationFilePath);
    initializationVectorStream.on('data', (chunk) => {
      const initializationVector = chunk as Buffer;
      const decipher = getDecipher(this._passphrase, initializationVector);
      pipeline(
        sourceStream,
        decipher,
        decompress(),
        destinationStream,
        (err) => {
          if (err) {
            console.error(err);
            this.emit(EVENT_NOTICE, 'Oops! Something went wrong!');
          }
        },
      );
    });
    this._handleSourceStream(sourceStream);
    this._handleDestinationStream(destinationStream);
  }

  private _handleSourceStream(sourceStream: ReadStream) {
    let currentSize = 0;
    const totalSize = getFileSize(this._sourceFilePath).size;
    sourceStream.on('data', (chunk) => {
      currentSize += chunk.length;
      this.emit(
        EVENT_SOURCE_STREAM_PROGRESS,
        calculateProgress(currentSize, totalSize),
      );
    });
  }

  private _handleDestinationStream(destinationStream: WriteStream) {
    destinationStream.on('finish', () => {
      this.emit(EVENT_DESTINATION_STREAM_FINISH);
    });
  }
}
