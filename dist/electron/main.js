"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
var electron_1 = require("electron");
var electron_log_1 = __importDefault(require("electron-log"));
var path_1 = __importDefault(require("path"));
var Crypto_1 = __importDefault(require("../business-logic/Crypto"));
var constants_1 = require("../constants");
var createWindow = function () {
    var mainWindow = new electron_1.BrowserWindow({
        width: 600,
        height: 600,
        webPreferences: {
            devTools: true,
            nodeIntegration: true,
        },
        icon: path_1.default.join('../../assets/icons/png/64x64.png'),
    });
    mainWindow.loadFile('dist/ui/index.html');
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
    return mainWindow;
};
var handleMode = function (eventName, event, arg) { return __awaiter(void 0, void 0, void 0, function () {
    var sourceFilePath, destinationFilePath, passphrase, verb, file, crypto_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sourceFilePath = arg.filePath;
                destinationFilePath = "" + arg.filePath;
                passphrase = arg.passphrase;
                verb = '';
                if (eventName === constants_1.EVENT_ENCRYPT) {
                    verb = 'Encrypting';
                    destinationFilePath += '.enc';
                }
                else if (eventName === constants_1.EVENT_DECRYPT) {
                    verb = 'Decrypting';
                    destinationFilePath = destinationFilePath.replace('.enc', '');
                }
                return [4 /*yield*/, electron_1.dialog.showSaveDialog({
                        defaultPath: destinationFilePath,
                    })];
            case 1:
                file = _a.sent();
                if (!file.canceled) {
                    crypto_1 = new Crypto_1.default(sourceFilePath, file.filePath, passphrase);
                    if (eventName === constants_1.EVENT_ENCRYPT) {
                        crypto_1.encrypt();
                    }
                    else {
                        crypto_1.decrypt();
                    }
                    crypto_1.on(constants_1.EVENT_NOTICE, function (data) {
                        event.sender.send(constants_1.EVENT_NOTICE, data);
                    });
                    crypto_1.on(constants_1.EVENT_SOURCE_STREAM_PROGRESS, function (progress) {
                        event.sender.send(constants_1.EVENT_NOTICE, verb + "..." + progress + "%");
                    });
                    crypto_1.on(constants_1.EVENT_DESTINATION_STREAM_FINISH, function () {
                        event.sender.send(constants_1.EVENT_NOTICE, "Done! File has been saved to: " + file.filePath);
                    });
                }
                return [2 /*return*/];
        }
    });
}); };
electron_1.app.on('ready', function () {
    console.log('ready');
    createWindow();
});
electron_1.app.on('window-all-closed', function () {
    console.log('window-all-closed', process.platform);
    if (process.platform === 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    console.log('activate');
    createWindow();
});
electron_1.ipcMain.on(constants_1.EVENT_LOG, function (e, arg) {
    electron_log_1.default.debug(arg);
});
electron_1.ipcMain.on(constants_1.EVENT_ENCRYPT, function (e, arg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        handleMode(constants_1.EVENT_ENCRYPT, e, arg);
        return [2 /*return*/];
    });
}); });
electron_1.ipcMain.on(constants_1.EVENT_DECRYPT, function (e, arg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        handleMode(constants_1.EVENT_DECRYPT, e, arg);
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbGVjdHJvbi9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdURBQXVEO0FBQ3ZELHFDQUErRDtBQUUvRCw4REFBK0I7QUFDL0IsOENBQXdCO0FBRXhCLG9FQUE4QztBQUM5QywwQ0FPc0I7QUFFdEIsSUFBTSxZQUFZLEdBQUc7SUFDbkIsSUFBSSxVQUFVLEdBQXlCLElBQUksd0JBQWEsQ0FBQztRQUN2RCxLQUFLLEVBQUUsR0FBRztRQUNWLE1BQU0sRUFBRSxHQUFHO1FBQ1gsY0FBYyxFQUFFO1lBQ2QsUUFBUSxFQUFFLElBQUk7WUFDZCxlQUFlLEVBQUUsSUFBSTtTQUN0QjtRQUNELElBQUksRUFBRSxjQUFJLENBQUMsSUFBSSxDQUFDLGtDQUFrQyxDQUFDO0tBQ3BELENBQUMsQ0FBQztJQUNILFVBQVUsQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUMxQyxVQUFVLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRTtRQUN0QixVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQyxDQUFDO0FBRUYsSUFBTSxVQUFVLEdBQUcsVUFBTyxTQUFpQixFQUFFLEtBQW1CLEVBQUUsR0FBUTs7Ozs7Z0JBQ2xFLGNBQWMsR0FBRyxHQUFHLENBQUMsUUFBa0IsQ0FBQztnQkFDMUMsbUJBQW1CLEdBQUcsS0FBRyxHQUFHLENBQUMsUUFBb0IsQ0FBQztnQkFDaEQsVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFvQixDQUFDO2dCQUN4QyxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNkLElBQUksU0FBUyxLQUFLLHlCQUFhLEVBQUU7b0JBQy9CLElBQUksR0FBRyxZQUFZLENBQUM7b0JBQ3BCLG1CQUFtQixJQUFJLE1BQU0s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