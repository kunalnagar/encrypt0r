const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');
const EventEmitter = require('events');
const inherits = require('util').inherits;

const Vector = require('./vector');

class Utils {

    constructor(originalFile, destinationFile, password) {
        EventEmitter.call(this);
        this.originalFile = originalFile;
        this.destinationFile = destinationFile;
        this.password = password;
        this.readStream;
        this.writeStream;
        this.readIv;
    }

    getCipherKey() {
        return crypto.createHash('sha256').update(this.password).digest();
    }

    encrypt() {
        let that = this;
        const initVector = crypto.randomBytes(16);
        const cipherKey = this.getCipherKey();
        this.readStream = fs.createReadStream(this.originalFile);
        const cipher = crypto.createCipheriv('aes-256-cbc', cipherKey, initVector);
        const initVectorStream = new Vector(initVector);
        this.writeStream = fs.createWriteStream(path.join(this.destinationFile));
        this.readStream
            .pipe(cipher)
            .pipe(initVectorStream)
            .pipe(this.writeStream);
        let _size = 0;
        let _stat = fs.statSync(this.originalFile);
        this.readStream.on('data', function(chunk) {
            _size += chunk.length;
            let _progress = Math.floor((_size / _stat.size) * 100);
            that.emit('progress', _progress);
        });
        this.writeStream.on('finish', function() {
            that.emit('finished');
        });
    }

    decrypt() {
        let initVector;
        let that = this;
        this.readIv = fs.createReadStream(this.originalFile, { end: 15 });
        this.readIv.on('data', (chunk) => {
            initVector = chunk;
        });
        this.readIv.on('close', (chunk) => {
            const cipherKey = this.getCipherKey();
            const decipher = crypto.createDecipheriv('aes-256-cbc', cipherKey, initVector);
            this.readStream = fs.createReadStream(this.originalFile, { start: 16 });
            this.writeStream = fs.createWriteStream(path.join(this.destinationFile));
            this.readStream
                .pipe(decipher)
                .pipe(this.writeStream);
        });
        this.readIv.on('close', (chunk) => {
            let _size = 0;
            let _stat = fs.statSync(this.originalFile);
            this.readStream.on('data', function(chunk) {
                _size += chunk.length;
                let _progress = Math.floor((_size / _stat.size) * 100);
                that.emit('progress', _progress);
            });
            this.writeStream.on('finish', function() {
                that.emit('finished');
            });
        });
    }
}

inherits(Utils, EventEmitter);

module.exports = Utils;
