const {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} = require("electron");

var mainWindow;
var log = require("electron-log")
var path = require("path")
var fs = require("fs");
var http = require("http");
var exec = require("child_process").exec
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
    var nameWithExt = "";
    if(arg.action === "encrypt") {
        nameWithExt = arg.filePath + ".enc";
    } else if(arg.action === "decrypt") {
        nameWithExt = arg.filePath.replace(/\.[^/.]+$/, "")
    }
    dialog.showSaveDialog({
        defaultPath: nameWithExt
    }, function (filename) {
        if(typeof filename !== "undefined") {
            if(arg.action === "encrypt") {
                log.info("Encrypting " + filename + " with password <redacted>");
                e.sender.send("notice-status", "Encrypting...")
                sCommand = "openssl enc -aes-256-cbc -salt -in " + arg.filePath + " -out " + filename + " -k " + arg.passphrase
            } else if(arg.action === "decrypt") {
                log.info("Decrypting " + filename + " with password <redacted>");
                e.sender.send("notice-status", "Decrypting...")
                sCommand = "openssl enc -d -aes-256-cbc -in " + arg.filePath + " -out " + filename + " -k " + arg.passphrase
            }
            child = exec(sCommand, function (err, stdout, stderr) {
                if (err !== null) {
                    log.error("Something went wrong while encrypting/decrypting...");
                    log.error(err);
                    e.sender.send("notice-status", "Something went wrong.");
                } else {
                    log.info("File successfully: " + arg.action);
                    e.sender.send("notice-status", "Done! File has been saved to: " + filename)
                }
            });
        } else {
            log.warn("Destination file location not selected");
            e.sender.send("notice-status", "Oops. Destination file location not selected. Press the Reset button and try again!")
        }
    });
});
