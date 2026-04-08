/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { Transform, TransformCallback } from 'stream';

export default class Vector extends Transform {
  private initVector: Uint8Array;

  private isAppended: boolean;

  constructor(initVector: Uint8Array) {
    super();
    this.initVector = initVector;
    this.isAppended = false;
  }

   
  _transform(
    chunk: any,
    encoding: BufferEncoding,
    cb: TransformCallback,
  ): void {
    if (!this.isAppended) {
      this.push(this.initVector);
      this.isAppended = true;
    }
    this.push(chunk);
    cb();
  }
}
