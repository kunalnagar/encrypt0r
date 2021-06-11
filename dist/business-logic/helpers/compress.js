"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decompress = exports.compress = void 0;
var zlib_1 = require("zlib");
var compress = function () {
    return zlib_1.createGzip();
};
exports.compress = compress;
var decompress = function () {
    return zlib_1.createGunzip();
};
exports.decompress = decompress;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcHJlc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYnVzaW5lc3MtbG9naWMvaGVscGVycy9jb21wcmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBOEQ7QUFFdkQsSUFBTSxRQUFRLEdBQUc7SUFDdEIsT0FBTyxpQkFBVSxFQUFFLENBQUM7QUFDdEIsQ0FBQyxDQUFDO0FBRlcsUUFBQSxRQUFRLFlBRW5CO0FBRUssSUFBTSxVQUFVLEdBQUc7SUFDeEIsT0FBTyxtQkFBWSxFQUFFLENBQUM7QUFDeEIsQ0FBQyxDQUFDO0FBRlcsUUFBQSxVQUFVLGNBRXJCIn0=