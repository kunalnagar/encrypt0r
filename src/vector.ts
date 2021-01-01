import { Transform } from 'stream';

export default class Vector extends Transform {
  private initVector: any;
  private isAppended: any;

  constructor(initVector: any, options?: any) {
    super(options);
    this.initVector = initVector;
    this.isAppended = false;
  }

  _transform(chunk: any, encoding: any, cb: any) {
    if (!this.isAppended) {
      this.push(this.initVector);
      this.isAppended = true;
    }
    this.push(chunk);
    cb();
  }
}
