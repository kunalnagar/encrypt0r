"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDecipher = exports.getCipher = void 0;
var crypto_1 = require("crypto");
var getCipherKey = function (password) {
    return crypto_1.createHash('sha256').update(password).digest();
};
var getCipher = function (password, initializationVector) {
    return crypto_1.createCipheriv('aes-256-cbc', getCipherKey(password), initializationVector);
};
exports.getCipher = getCipher;
var getDecipher = function (password, initializationVector) {
    return crypto_1.createDecipheriv('aes-256-cbc', getCipherKey(password), initializationVector);
};
exports.getDecipher = getDecipher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lwaGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2J1c2luZXNzLWxvZ2ljL2hlbHBlcnMvY2lwaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQU1nQjtBQUVoQixJQUFNLFlBQVksR0FBRyxVQUFDLFFBQWdCO0lBQ3BDLE9BQU8sbUJBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDeEQsQ0FBQyxDQUFDO0FBRUssSUFBTSxTQUFTLEdBQUcsVUFDdkIsUUFBZ0IsRUFDaEIsb0JBQTRCO0lBRTVCLE9BQU8sdUJBQWMsQ0FDbkIsYUFBYSxFQUNiLFlBQVksQ0FBQyxRQUFRLENBQUMsRUFDdEIsb0JBQW9CLENBQ3JCLENBQUM7QUFDSixDQUFDLENBQUM7QUFUVyxRQUFBLFNBQVMsYUFTcEI7QUFFSyxJQUFNLFdBQVcsR0FBRyxVQUN6QixRQUFnQixFQUNoQixvQkFBNEI7SUFFNUIsT0FBTyx5QkFBZ0IsQ0FDckIsYUFBYSxFQUNiLFlBQVksQ0FBQyxRQUFRLENBQUMsRUFDdEIsb0JBQW9CLENBQ3JCLENBQUM7QUFDSixDQUFDLENBQUM7QUFUVyxRQUFBLFdBQVcsZUFTdEIifQ==