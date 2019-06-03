const {
    app,
    BrowserWindow,
    ipcMain,
    dialog,
} = require('electron');

let mainWindow;
const log = require('electron-log');
const path = require('path');

const Utils = require('./src/utils');

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
        icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
    });
    mainWindow.loadFile('index.html');
    log.info('created main window and loaded main page');
    mainWindow.on('closed', () => {
        mainWindow = null;
        log.info('closed main window');
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('event:log', (e, arg) => {
    log.debug(arg);
});

ipcMain.on('action:encrypt_decrypt', (e, arg) => {
    log.info('encrypting or decrypting...');
    let popupFileName;
    if (arg.action === 'encrypt') {
        popupFileName = `${arg.filePath}.enc`;
    } else if (arg.action === 'decrypt') {
        popupFileName = arg.filePath.replace('.enc', '');
    }
    let utils;
    dialog.showSaveDialog({
        defaultPath: popupFileName,
    }, (filename) => {
        if (typeof filename !== 'undefined') {
            utils = new Utils(arg.filePath, filename, arg.passphrase);
            if (arg.action === 'encrypt') {
                log.info(`Encrypting ${filename} with password <redacted>`);
                utils.encrypt();
                utils.on('progress', (progress) => {
                    e.sender.send('notice-status', `Encrypting...${progress}%`);
                });
                utils.on('finished', () => {
                    log.info('File successfully encrypted!');
                    e.sender.send('notice-status', `Done! File has been saved to: ${filename}`);
                });
            } else if (arg.action === 'decrypt') {
                log.info(`Decrypting ${filename} with password <redacted>`);
                utils.decrypt();
                utils.on('progress', (progress) => {
                    e.sender.send('notice-status', `Decrypting...${progress}%`);
                });
                utils.on('finished', () => {
                    log.info('File successfully decrypted!');
                    e.sender.send('notice-status', `Done! File has been saved to: ${filename}`);
                });
            }
        } else {
            log.warn('Destination file location not selected');
            e.sender.send('notice-status', 'Oops. Destination file location not selected. Please try again!');
        }
    });
});
