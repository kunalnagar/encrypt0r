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
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
var stream_1 = require("stream");
var Vector = /** @class */ (function (_super) {
    __extends(Vector, _super);
    function Vector(initVector) {
        var _this = _super.call(this) || this;
        _this.initVector = initVector;
        _this.isAppended = false;
        return _this;
    }
    Vector.prototype._transform = function (chunk, encoding, cb) {
        if (!this.isAppended) {
            this.push(this.initVector);
            this.isAppended = true;
        }
        this.push(chunk);
        cb();
    };
    return Vector;
}(stream_1.Transform));
exports.default = Vector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2J1c2luZXNzLWxvZ2ljL2hlbHBlcnMvdmVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdURBQXVEO0FBQ3ZELHNFQUFzRTtBQUN0RSxpQ0FBc0Q7QUFFdEQ7SUFBb0MsMEJBQVM7SUFJM0MsZ0JBQVksVUFBa0I7UUFBOUIsWUFDRSxpQkFBTyxTQUdSO1FBRkMsS0FBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsS0FBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7O0lBQzFCLENBQUM7SUFFRCwyQkFBVSxHQUFWLFVBQ0UsS0FBVSxFQUNWLFFBQXdCLEVBQ3hCLEVBQXFCO1FBRXJCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1NBQ3hCO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqQixFQUFFLEVBQUUsQ0FBQztJQUNQLENBQUM7SUFDSCxhQUFDO0FBQUQsQ0FBQyxBQXRCRCxDQUFvQyxrQkFBUyxHQXNCNUMifQ==