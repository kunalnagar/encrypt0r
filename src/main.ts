import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import log from 'electron-log';
import path from 'path';

import Crypto, { ICrypto } from './Crypto';

let mainWindow: BrowserWindow | null;

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

ipcMain.on('action:encrypt_decrypt', async (e, arg) => {
  log.info('encrypting or decrypting...');
  let popupFileName;
  if (arg.action === 'encrypt') {
    popupFileName = `${arg.filePath}.enc`;
  } else if (arg.action === 'decrypt') {
    popupFileName = arg.filePath.replace('.enc', '');
  }
  let crypto: ICrypto;
  try {
    const file = await dialog.showSaveDialog({
      defaultPath: popupFileName,
    });
    if (typeof file !== 'undefined') {
      crypto = new Crypto(
        arg.filePath,
        file.filePath as string,
        arg.passphrase,
      );
      if (arg.action === 'encrypt') {
        log.info(`Encrypting ${file.filePath} with password <redacted>`);
        crypto.encrypt();
        crypto.on('crypto:source_stream:progress', (progress) => {
          e.sender.send('notice-status', `Encrypting...${progress}%`);
        });
        crypto.on('crypto:destination_stream:finish', () => {
          log.info('File successfully encrypted!');
          e.sender.send(
            'notice-status',
            `Done! File has been saved to: ${file.filePath}`,
          );
        });
      } else if (arg.action === 'decrypt') {
        log.info(`Decrypting ${file.filePath} with password <redacted>`);
        crypto.decrypt();
        crypto.on('crypto:source_stream:progress', (progress) => {
          e.sender.send('notice-status', `Decrypting...${progress}%`);
        });
        crypto.on('crypto:destination_stream:finish', () => {
          log.info('File successfully decrypted!');
          e.sender.send(
            'notice-status',
            `Done! File has been saved to: ${file.filePath}`,
          );
        });
        crypto.on('error', (reason) => {
          if (reason === 'BAD_DECRYPT') {
            e.sender.send(
              'notice-status',
              'Oops. The passphrase is incorrect.',
            );
          }
        });
      }
    } else {
      log.warn('Destination file location not selected');
      e.sender.send(
        'notice-status',
        'Oops. Destination file location not selected. Please try again!',
      );
    }
  } catch (err) {
    log.error('Something went wrong', err);
    e.sender.send(
      'notice-status',
      'Oops. Something went wrong. Please reset and try again.',
    );
  }
});
