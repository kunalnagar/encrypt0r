const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');
const EventEmitter = require('events');
const inherits = require('util').inherits;

const Vector = require('./vector');

function _calculateProgress(chunkSize, totalSize) {
    return Math.floor((chunkSize / totalSize) * 100);
}

class Utils {

    constructor(originalFile, destinationFile, password) {
        EventEmitter.call(this);
        this.originalFile = originalFile;
        this.destinationFile = destinationFile;
        this.password = password;
    }

    getCipherKey() {
        return crypto.createHash('sha256').update(this.password).digest();
    }

    encrypt() {
        let that = this;
        let initVector = crypto.randomBytes(16);
        let cipherKey = this.getCipherKey();
        let readStream = fs.createReadStream(this.originalFile);
        let cipher = crypto.createCipheriv('aes-256-cbc', cipherKey, initVector);
        let initVectorStream = new Vector(initVector);
        let writeStream = fs.createWriteStream(path.join(this.destinationFile));
        let _size = 0, _stat;
        readStream
            .pipe(cipher)
            .pipe(initVectorStream)
            .pipe(writeStream);
        _size = 0;
        _stat = fs.statSync(this.originalFile);
        readStream.on('data', function(chunk) {
            _size += chunk.length;
            that.emit('progress', _calculateProgress(_size, _stat.size));
        });
        writeStream.on('finish', function() {
            that.emit('finished');
        });
    }

    decrypt() {
        let that = this;
        let initVector;
        let _size = 0, _stat;
        let initVectorStream = fs.createReadStream(this.originalFile, { end: 15 });
        let cipherKey, decipher;
        let readStream, writeStream;
        initVectorStream.on('data', (chunk) => {
            initVector = chunk;
        });
        initVectorStream.on('close', (chunk) => {
            cipherKey = this.getCipherKey();
            decipher = crypto.createDecipheriv('aes-256-cbc', cipherKey, initVector);
            readStream = fs.createReadStream(this.originalFile, { start: 16 });
            writeStream = fs.createWriteStream(path.join(this.destinationFile));
            readStream
                .pipe(decipher)
                .pipe(writeStream);
        });
        initVectorStream.on('close', (chunk) => {
            _size = 0;
            _stat = fs.statSync(this.originalFile);
            readStream.on('data', function(chunk) {
                _size += chunk.length;
                that.emit('progress', _calculateProgress(_size, _stat.size));
            });
            writeStream.on('finish', function() {
                that.emit('finished');
            });
        });
    }
}

inherits(Utils, EventEmitter);

module.exports = Utils;
