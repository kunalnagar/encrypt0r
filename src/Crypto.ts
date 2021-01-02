import { EventEmitter } from 'events';
import { ReadStream, WriteStream } from 'fs';

import { getCipher, getDecipher } from './utils/cipher';
import { compress, decompress } from './utils/compress';
import { getFileSize } from './utils/file-size';
import {
  getInitializationVector,
  getInitializationVectorStream,
} from './utils/initialization-vector';
import { calculateProgress } from './utils/progress';
import { getDestinationStream, getSourceStream } from './utils/stream';

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
    sourceStream
      .pipe(compress())
      .pipe(cipher)
      .pipe(initializationVectorStream)
      .pipe(destinationStream);
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
      sourceStream.pipe(decipher).pipe(decompress()).pipe(destinationStream);
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
        'crypto:source_stream:progress',
        calculateProgress(currentSize, totalSize),
      );
    });
  }

  private _handleDestinationStream(destinationStream: WriteStream) {
    destinationStream.on('finish', () => {
      this.emit('crypto:destination_stream:finish');
    });
  }
}
