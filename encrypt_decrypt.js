var fs = require("fs");
var crypto = require("crypto");
var log = require("electron-log");

module.exports = class EncryptDecrypt {

	constructor(finalFile, filePath, passphrase) {
		this.finalFile = finalFile;
		this.filePath = filePath;
		this.passphrase = passphrase;
	}

	encrypt(data) {
		try {
			var cipher = crypto.createCipher('aes-256-cbc', this.passphrase);
			data.pipe(cipher).pipe(fs.createWriteStream(this.finalFile));
	        return {
	        	code: 200,
	        	message: "Encrypted"
	        };
		} catch(e) {
			throw new Error(e.message);
		}
	}

	decrypt(data) {
		try {
	        var decipher = crypto.createDecipher("aes-256-cbc", this.passphrase);
	        data.pipe(decipher).pipe(fs.createWriteStream(this.finalFile));
	        return {
	        	code: 200,
	        	message: "Decrypted"
	        };
	    } catch (exception) {
	        throw new Error(exception.message);
	    }
	}

}