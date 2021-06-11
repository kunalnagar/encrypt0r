"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
var electron_1 = require("electron");
var jquery_1 = __importDefault(require("jquery"));
var constants_1 = require("../constants");
var $window = jquery_1.default(window);
var sendEventToElectron = function (eventName, data) {
    return electron_1.ipcRenderer.send(eventName, data);
};
$window.on(constants_1.EVENT_LOG, function (e, data) { return sendEventToElectron(constants_1.EVENT_LOG, data); });
$window.on(constants_1.EVENT_ENCRYPT, function (e, data) {
    return sendEventToElectron(constants_1.EVENT_ENCRYPT, data);
});
$window.on(constants_1.EVENT_DECRYPT, function (e, data) {
    return sendEventToElectron(constants_1.EVENT_DECRYPT, data);
});
electron_1.ipcRenderer.on(constants_1.EVENT_NOTICE, function (e, data) {
    $window.trigger(constants_1.EVENT_NOTICE, data);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWktYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbGVjdHJvbi91aS1hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsdURBQXVEO0FBQ3ZELHFDQUF1QztBQUN2QyxrREFBdUI7QUFFdkIsMENBS3NCO0FBRXRCLElBQU0sT0FBTyxHQUFHLGdCQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFMUIsSUFBTSxtQkFBbUIsR0FBRyxVQUFDLFNBQWlCLEVBQUUsSUFBVTtJQUN4RCxPQUFBLHNCQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUM7QUFBakMsQ0FBaUMsQ0FBQztBQUVwQyxPQUFPLENBQUMsRUFBRSxDQUFDLHFCQUFTLEVBQUUsVUFBQyxDQUFDLEVBQUUsSUFBSSxJQUFLLE9BQUEsbUJBQW1CLENBQUMscUJBQVMsRUFBRSxJQUFJLENBQUMsRUFBcEMsQ0FBb0MsQ0FBQyxDQUFDO0FBQ3pFLE9BQU8sQ0FBQyxFQUFFLENBQUMseUJBQWEsRUFBRSxVQUFDLENBQUMsRUFBRSxJQUFJO0lBQ2hDLE9BQUEsbUJBQW1CLENBQUMseUJBQWEsRUFBRSxJQUFJLENBQUM7QUFBeEMsQ0FBd0MsQ0FDekMsQ0FBQztBQUNGLE9BQU8sQ0FBQyxFQUFFLENBQUMseUJBQWEsRUFBRSxVQUFDLENBQUMsRUFBRSxJQUFJO0lBQ2hDLE9BQUEsbUJBQW1CLENBQUMseUJBQWEsRUFBRSxJQUFJLENBQUM7QUFBeEMsQ0FBd0MsQ0FDekMsQ0FBQztBQUVGLHNCQUFXLENBQUMsRUFBRSxDQUFDLHdCQUFZLEVBQUUsVUFBQyxDQUFDLEVBQUUsSUFBSTtJQUNuQyxPQUFPLENBQUMsT0FBTyxDQUFDLHdCQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDdEMsQ0FBQyxDQUFDLENBQUMifQ==