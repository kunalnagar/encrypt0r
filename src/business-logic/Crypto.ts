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
  private sourceFilePath: string;

  private destinationFilePath: string;

  private passphrase: string;

  constructor(
    sourceFilePath: string,
    destinationFilePath: string,
    passphrase: string,
  ) {
    super();
    this.sourceFilePath = sourceFilePath;
    this.destinationFilePath = destinationFilePath;
    this.passphrase = passphrase;
  }

  encrypt(): void {
    const initializationVector = getInitializationVector();
    const initializationVectorStream =
      getInitializationVectorStream(initializationVector);
    const cipher = getCipher(this.passphrase, initializationVector);
    const sourceStream = getSourceStream(this.sourceFilePath);
    const destinationStream = getDestinationStream(this.destinationFilePath);
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
    this.handleSourceStream(sourceStream);
    this.handleDestinationStream(destinationStream);
  }

  decrypt(): void {
    const initializationVectorStream = getSourceStream(
      this.sourceFilePath,
      0,
      15,
    );
    const sourceStream = getSourceStream(this.sourceFilePath, 16);
    const destinationStream = getDestinationStream(this.destinationFilePath);
    initializationVectorStream.on('data', (chunk) => {
      const initializationVector = chunk as Buffer;
      const decipher = getDecipher(this.passphrase, initializationVector);
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
    this.handleSourceStream(sourceStream);
    this.handleDestinationStream(destinationStream);
  }

  private handleSourceStream(sourceStream: ReadStream) {
    let currentSize = 0;
    const totalSize = getFileSize(this.sourceFilePath).size;
    sourceStream.on('data', (chunk) => {
      currentSize += chunk.length;
      this.emit(
        EVENT_SOURCE_STREAM_PROGRESS,
        calculateProgress(currentSize, totalSize),
      );
    });
  }

  private handleDestinationStream(destinationStream: WriteStream) {
    destinationStream.on('finish', () => {
      this.emit(EVENT_DESTINATION_STREAM_FINISH);
    });
  }
}
