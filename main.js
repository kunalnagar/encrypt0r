const {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} = require("electron");

var mainWindow;
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

    // mainWindow.webContents.openDevTools()

    mainWindow.on("closed", function () {
        mainWindow = null;
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

// TODO
ipcMain.on("action:reset", function(e, erg) {

});

ipcMain.on("action:encrypt_decrypt", function (e, arg) {
    console.log(arg);
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
                e.sender.send("notice-status", "Encrypting...")
                sCommand = "openssl enc -aes-256-cbc -salt -in " + arg.filePath + " -out " + filename + " -k " + arg.passphrase
            } else if(arg.action === "decrypt") {
                e.sender.send("notice-status", "Decrypting...")
                sCommand = "openssl enc -d -aes-256-cbc -in " + arg.filePath + " -out " + filename + " -k " + arg.passphrase
            }
            child = exec(sCommand, function (err, stdout, stderr) {
                if (err !== null) {
                    console.log(err);
                    e.sender.send("notice-status", "Something went wrong. Make sure your passphrase is correct and try again.");
                } else {
                    e.sender.send("notice-status", "Done! File has been saved to: " + filename)
                }
            });
        } else {
            e.sender.send("notice-status", "Oops. Destination file location not selected. Press the Reset button and try again!")
        }
    });
});
