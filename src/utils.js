const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

const Vector = require('./vector');

class Utils {

    constructor(originalFile, destinationFile, password) {
        this.originalFile = originalFile;
        this.destinationFile = destinationFile;
        this.password = password;
        this.readStream;
        this.writeStream;
    }

    getCipherKey() {
        return crypto.createHash('sha256').update(this.password, ).digest();
    }

    getInitializationVector() {
        return crypto.randomBytes(16);
    }

    encrypt(cb) {
        const initVector = this.getInitializationVector();
        const cipherKey = this.getCipherKey();
        this.readStream = fs.createReadStream(this.originalFile);
        // const gzipStream = zlib.createGzip();
        const cipher = crypto.createCipheriv('aes-256-cbc', cipherKey, initVector);
        const initVectorStream = new Vector(initVector);
        this.writeStream = fs.createWriteStream(path.join(this.destinationFile));
        this.readStream
            // .pipe(gzipStream)
            .pipe(cipher)
            .pipe(initVectorStream)
            .pipe(this.writeStream);
        // let stat = fs.statSync(this.destinationFile);
        // let str = progress({
        //     length: stat.size,
        //     time: 100
        // });
        // writeStream.on('finish', () => {
        //     console.log('write stream finished');
        //     cb();
        // });
    }
}

module.exports = Utils;
