const { Transform } = require('stream')

class Vector extends Transform {
  constructor(initVector, options) {
    super(options)
    this.initVector = initVector
    this.isAppended = false
  }

  _transform(chunk, encoding, cb) {
    if (!this.isAppended) {
      this.push(this.initVector)
      this.isAppended = true
    }
    this.push(chunk)
    cb()
  }
}

module.exports = Vector
