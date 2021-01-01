import crypto from 'crypto';
import { EventEmitter } from 'events';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

import Vector from './vector';

function calculateProgress(chunkSize: number, totalSize: number) {
  return Math.floor((chunkSize / totalSize) * 100);
}

export default class Utils extends EventEmitter {
  private originalFile: any;
  private destinationFile: any;
  private password: string;

  constructor(originalFile: any, destinationFile: any, password: string) {
    super();
    this.originalFile = originalFile;
    this.destinationFile = destinationFile;
    this.password = password;
  }

  getCipherKey(): Buffer {
    return crypto.createHash('sha256').update(this.password).digest();
  }

  encrypt(): void {
    const initVector = crypto.randomBytes(16);
    const cipherKey = this.getCipherKey();
    const readStream = fs.createReadStream(this.originalFile);
    const cipher = crypto.createCipheriv('aes-256-cbc', cipherKey, initVector);
    const initVectorStream = new Vector(initVector);
    const writeStream = fs.createWriteStream(path.join(this.destinationFile));
    const stat = fs.statSync(this.originalFile);
    const gzip = zlib.createGzip();
    let size = 0;
    readStream.pipe(gzip).pipe(cipher).pipe(initVectorStream).pipe(writeStream);
    readStream.on('data', (chunk) => {
      size += chunk.length;
      this.emit('progress', calculateProgress(size, stat.size));
    });
    writeStream.on('finish', () => {
      this.emit('finished');
    });
  }

  decrypt(): void {
    const initVectorStream = fs.createReadStream(this.originalFile, {
      end: 15,
    });
    const unzip = zlib.createGunzip();
    let initVector: any;
    let size = 0;
    let cipherKey;
    let decipher;
    let readStream: any;
    let writeStream: any;
    initVectorStream.on('data', (chunk) => {
      initVector = chunk;
    });
    initVectorStream.on('close', () => {
      cipherKey = this.getCipherKey();
      decipher = crypto.createDecipheriv('aes-256-cbc', cipherKey, initVector);
      readStream = fs.createReadStream(this.originalFile, { start: 16 });
      writeStream = fs.createWriteStream(path.join(this.destinationFile));
      readStream
        .pipe(decipher)
        .pipe(unzip)
        .on('error', (err: any) => {
          this.emit('error', err.reason);
        })
        .pipe(writeStream);
    });
    initVectorStream.on('close', () => {
      const stat = fs.statSync(this.originalFile);
      readStream.on('data', (chunk: any) => {
        size += chunk.length;
        this.emit('progress', calculateProgress(size, stat.size));
      });
      writeStream.on('finish', () => {
        this.emit('finished');
      });
    });
  }
}
