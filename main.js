const {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} = require('electron');

const mainWindow;
const log = require('electron-log')
const path = require('path')

const Utils = require('./src/utils');

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        icon: path.join(__dirname, 'assets/icons/png/64x64.png')
    });
    mainWindow.loadFile('index.html');
    log.info('created main window and loaded main page');
    mainWindow.on('closed', function () {
        mainWindow = null;
        log.info('closed main window');
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('event:log', function(e, arg) {
    log.debug(arg);
});

ipcMain.on('action:encrypt_decrypt', function (e, arg) {
    log.info('encrypting or decrypting...');
    let key = arg.passphrase;
    let cipher;
    let input;
    let output;
    let popupFileName;
    if(arg.action === 'encrypt') {
        popupFileName = arg.filePath + '.enc';
    } else if(arg.action === 'decrypt') {
        popupFileName = arg.filePath.replace('.enc', '');
    }
    let edHelper;
    let result;
    let utils;
    dialog.showSaveDialog({
        defaultPath: popupFileName
    }, function (filename) {
        if(typeof filename !== 'undefined') {
            utils = new Utils(arg.filePath, filename, arg.passphrase);
            if(arg.action === 'encrypt') {
                log.info('Encrypting ' + filename + ' with password <redacted>');
                utils.encrypt();
                utils.on('progress', function(progress) {
                    e.sender.send('notice-status', 'Encrypting...' + progress + '%');
                });
                utils.on('finished', function() {
                    log.info('File successfully encrypted!');
                    e.sender.send('notice-status', 'Done! File has been saved to: ' + filename);
                });
            } else if(arg.action === 'decrypt') {
                log.info('Decrypting ' + filename + ' with password <redacted>');
                utils.decrypt();
                utils.on('progress', function(progress) {
                    e.sender.send('notice-status', 'Decrypting...' + progress + '%');
                });
                utils.on('finished', function() {
                    log.info('File successfully decrypted!');
                    e.sender.send('notice-status', 'Done! File has been saved to: ' + filename);
                });
            }
        } else {
            log.warn('Destination file location not selected');
            e.sender.send('notice-status', 'Oops. Destination file location not selected. Please try again!')
        }
    });
});
