const {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} = require("electron");

require('update-electron-app')()

var mainWindow;
var log = require("electron-log")
var path = require("path")
var fs = require("fs");
var http = require("http");
var exec = require("child_process").exec
var crypto = require("crypto");
var EncryptDecryptHelper = require("./encrypt_decrypt");
var child;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        icon: path.join(__dirname, "assets/icons/png/64x64.png")
    });
    mainWindow.loadFile("index.html");
    log.info("created main window and loaded main page");
    // mainWindow.webContents.openDevTools()
    mainWindow.on("closed", function () {
        mainWindow = null;
        log.info("closed main window");
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on("event:log", function(e, arg) {
    log.debug(arg);
});

ipcMain.on("action:encrypt_decrypt", function (e, arg) {
    log.info("encrypting or decrypting...");
    log.debug(arg);
    var key = arg.passphrase;
    var cipher;
    var input;
    var output;
    var popupFileName;
    if(arg.action === "encrypt") {
        popupFileName = arg.filePath + ".enc";
    } else if(arg.action === "decrypt") {
        popupFileName = arg.filePath.replace(".enc", "");
    }
    var edHelper;
    var result;
    dialog.showSaveDialog({
        defaultPath: popupFileName
    }, function (filename) {
        if(typeof filename !== "undefined") {
            edHelper = new EncryptDecryptHelper(filename, arg.filePath, arg.passphrase)
            if(arg.action === "encrypt") {
                log.info("Encrypting " + filename + " with password <redacted>");
                e.sender.send("notice-status", "Encrypting...")
                result = edHelper.encrypt(fs.createReadStream(arg.filePath));
                if(result && result.code === 200) {
                    log.info("File successfully encrypted!");
                    e.sender.send("notice-status", "Done! File has been saved to: " + filename)
                }
            } else if(arg.action === "decrypt") {
                log.info("Decrypting " + filename + " with password <redacted>");
                e.sender.send("notice-status", "Decrypting...")
                result = edHelper.decrypt(fs.createReadStream(arg.filePath));
                if(result && result.code === 200) {
                    log.info("File successfully decrypted!");
                    e.sender.send("notice-status", "Done! File has been saved to: " + filename)
                }
            }
        } else {
            log.warn("Destination file location not selected");
            e.sender.send("notice-status", "Oops. Destination file location not selected. Please try again!")
        }
    });
});
