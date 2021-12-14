/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Transform, TransformCallback } from 'stream';

export default class Vector extends Transform {
  private initVector: Buffer;

  private isAppended: boolean;

  constructor(initVector: Buffer) {
    super();
    this.initVector = initVector;
    this.isAppended = false;
  }

  // eslint-disable-next-line no-underscore-dangle
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
