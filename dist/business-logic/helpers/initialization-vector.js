"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInitializationVectorStream = exports.getInitializationVector = void 0;
var crypto_1 = require("crypto");
var vector_1 = __importDefault(require("./vector"));
var getInitializationVector = function () {
    return crypto_1.randomBytes(16);
};
exports.getInitializationVector = getInitializationVector;
var getInitializationVectorStream = function (initializationVector) {
    return new vector_1.default(initializationVector);
};
exports.getInitializationVectorStream = getInitializationVectorStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdGlhbGl6YXRpb24tdmVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2J1c2luZXNzLWxvZ2ljL2hlbHBlcnMvaW5pdGlhbGl6YXRpb24tdmVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGlDQUFxQztBQUVyQyxvREFBOEI7QUFFdkIsSUFBTSx1QkFBdUIsR0FBRztJQUNyQyxPQUFPLG9CQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDekIsQ0FBQyxDQUFDO0FBRlcsUUFBQSx1QkFBdUIsMkJBRWxDO0FBRUssSUFBTSw2QkFBNkIsR0FBRyxVQUMzQyxvQkFBNEI7SUFFNUIsT0FBTyxJQUFJLGdCQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUMxQyxDQUFDLENBQUM7QUFKVyxRQUFBLDZCQUE2QixpQ0FJeEMifQ==