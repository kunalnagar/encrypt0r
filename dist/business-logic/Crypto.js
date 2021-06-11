"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var stream_1 = require("stream");
var constants_1 = require("../constants");
var cipher_1 = require("./helpers/cipher");
var compress_1 = require("./helpers/compress");
var file_size_1 = require("./helpers/file-size");
var initialization_vector_1 = require("./helpers/initialization-vector");
var progress_1 = require("./helpers/progress");
var stream_2 = require("./helpers/stream");
var Crypto = /** @class */ (function (_super) {
    __extends(Crypto, _super);
    function Crypto(sourceFilePath, destinationFilePath, passphrase) {
        var _this = _super.call(this) || this;
        _this._sourceFilePath = sourceFilePath;
        _this._destinationFilePath = destinationFilePath;
        _this._passphrase = passphrase;
        return _this;
    }
    Crypto.prototype.encrypt = function () {
        var _this = this;
        var initializationVector = initialization_vector_1.getInitializationVector();
        var initializationVectorStream = initialization_vector_1.getInitializationVectorStream(initializationVector);
        var cipher = cipher_1.getCipher(this._passphrase, initializationVector);
        var sourceStream = stream_2.getSourceStream(this._sourceFilePath);
        var destinationStream = stream_2.getDestinationStream(this._destinationFilePath);
        stream_1.pipeline(sourceStream, compress_1.compress(), cipher, initializationVectorStream, destinationStream, function (err) {
            if (err) {
                console.error(err);
                _this.emit(constants_1.EVENT_NOTICE, 'Oops! Something went wrong!');
            }
        });
        this._handleSourceStream(sourceStream);
        this._handleDestinationStream(destinationStream);
    };
    Crypto.prototype.decrypt = function () {
        var _this = this;
        var initializationVectorStream = stream_2.getSourceStream(this._sourceFilePath, 0, 15);
        var sourceStream = stream_2.getSourceStream(this._sourceFilePath, 16);
        var destinationStream = stream_2.getDestinationStream(this._destinationFilePath);
        initializationVectorStream.on('data', function (chunk) {
            var initializationVector = chunk;
            var decipher = cipher_1.getDecipher(_this._passphrase, initializationVector);
            stream_1.pipeline(sourceStream, decipher, compress_1.decompress(), destinationStream, function (err) {
                if (err) {
                    console.error(err);
                    _this.emit(constants_1.EVENT_NOTICE, 'Oops! Something went wrong!');
                }
            });
        });
        this._handleSourceStream(sourceStream);
        this._handleDestinationStream(destinationStream);
    };
    Crypto.prototype._handleSourceStream = function (sourceStream) {
        var _this = this;
        var currentSize = 0;
        var totalSize = file_size_1.getFileSize(this._sourceFilePath).size;
        sourceStream.on('data', function (chunk) {
            currentSize += chunk.length;
            _this.emit(constants_1.EVENT_SOURCE_STREAM_PROGRESS, progress_1.calculateProgress(currentSize, totalSize));
        });
    };
    Crypto.prototype._handleDestinationStream = function (destinationStream) {
        var _this = this;
        destinationStream.on('finish', function () {
            _this.emit(constants_1.EVENT_DESTINATION_STREAM_FINISH);
        });
    };
    return Crypto;
}(events_1.EventEmitter));
exports.default = Crypto;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3J5cHRvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2J1c2luZXNzLWxvZ2ljL0NyeXB0by50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlDQUFzQztBQUV0QyxpQ0FBa0M7QUFFbEMsMENBSXNCO0FBQ3RCLDJDQUEwRDtBQUMxRCwrQ0FBMEQ7QUFDMUQsaURBQWtEO0FBQ2xELHlFQUd5QztBQUN6QywrQ0FBdUQ7QUFDdkQsMkNBQXlFO0FBT3pFO0lBQW9DLDBCQUFZO0lBSzlDLGdCQUNFLGNBQXNCLEVBQ3RCLG1CQUEyQixFQUMzQixVQUFrQjtRQUhwQixZQUtFLGlCQUFPLFNBSVI7UUFIQyxLQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztRQUN0QyxLQUFJLENBQUMsb0JBQW9CLEdBQUcsbUJBQW1CLENBQUM7UUFDaEQsS0FBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7O0lBQ2hDLENBQUM7SUFFRCx3QkFBTyxHQUFQO1FBQUEsaUJBdUJDO1FBdEJDLElBQU0sb0JBQW9CLEdBQUcsK0NBQXVCLEVBQUUsQ0FBQztRQUN2RCxJQUFNLDBCQUEwQixHQUFHLHFEQUE2QixDQUM5RCxvQkFBb0IsQ0FDckIsQ0FBQztRQUNGLElBQU0sTUFBTSxHQUFHLGtCQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1FBQ2pFLElBQU0sWUFBWSxHQUFHLHdCQUFlLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzNELElBQU0saUJBQWlCLEdBQUcsNkJBQW9CLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDMUUsaUJBQVEsQ0FDTixZQUFZLEVBQ1osbUJBQVEsRUFBRSxFQUNWLE1BQU0sRUFDTiwwQkFBMEIsRUFDMUIsaUJBQWlCLEVBQ2pCLFVBQUMsR0FBRztZQUNGLElBQUksR0FBRyxFQUFFO2dCQUNQLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ25CLEtBQUksQ0FBQyxJQUFJLENBQUMsd0JBQVksRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO2FBQ3hEO1FBQ0gsQ0FBQyxDQUNGLENBQUM7UUFDRixJQUFJLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELHdCQUFPLEdBQVA7UUFBQSxpQkEwQkM7UUF6QkMsSUFBTSwwQkFBMEIsR0FBRyx3QkFBZSxDQUNoRCxJQUFJLENBQUMsZUFBZSxFQUNwQixDQUFDLEVBQ0QsRUFBRSxDQUNILENBQUM7UUFDRixJQUFNLFlBQVksR0FBRyx3QkFBZSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDL0QsSUFBTSxpQkFBaUIsR0FBRyw2QkFBb0IsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUMxRSwwQkFBMEIsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSztZQUMxQyxJQUFNLG9CQUFvQixHQUFHLEtBQWUsQ0FBQztZQUM3QyxJQUFNLFFBQVEsR0FBRyxvQkFBVyxDQUFDLEtBQUksQ0FBQyxXQUFXLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztZQUNyRSxpQkFBUSxDQUNOLFlBQVksRUFDWixRQUFRLEVBQ1IscUJBQVUsRUFBRSxFQUNaLGlCQUFpQixFQUNqQixVQUFDLEdBQUc7Z0JBQ0YsSUFBSSxHQUFHLEVBQUU7b0JBQ1AsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDbkIsS0FBSSxDQUFDLElBQUksQ0FBQyx3QkFBWSxFQUFFLDZCQUE2QixDQUFDLENBQUM7aUJBQ3hEO1lBQ0gsQ0FBQyxDQUNGLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsd0JBQXdCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRU8sb0NBQW1CLEdBQTNCLFVBQTRCLFlBQXdCO1FBQXBELGlCQVVDO1FBVEMsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLElBQU0sU0FBUyxHQUFHLHVCQUFXLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUN6RCxZQUFZLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFDLEtBQUs7WUFDNUIsV0FBVyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDNUIsS0FBSSxDQUFDLElBQUksQ0FDUCx3Q0FBNEIsRUFDNUIsNEJBQWlCLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUMxQyxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8seUNBQXdCLEdBQWhDLFVBQWlDLGlCQUE4QjtRQUEvRCxpQkFJQztRQUhDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUU7WUFDN0IsS0FBSSxDQUFDLElBQUksQ0FBQywyQ0FBK0IsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILGFBQUM7QUFBRCxDQUFDLEFBdEZELENBQW9DLHFCQUFZLEdBc0YvQyJ9