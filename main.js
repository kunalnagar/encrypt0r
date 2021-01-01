import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { debug, error, info, warn } from 'electron-log';
import { join } from 'path';
import Utils from './src/utils';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: join(__dirname, 'assets/icons/png/64x64.png'),
  });
  mainWindow.loadFile('index.html');
  info('created main window and loaded main page');
  mainWindow.on('closed', () => {
    mainWindow = null;
    info('closed main window');
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
  debug(arg);
});

ipcMain.on('action:encrypt_decrypt', async (e, arg) => {
  info('encrypting or decrypting...');
  let popupFileName;
  if (arg.action === 'encrypt') {
    popupFileName = `${arg.filePath}.enc`;
  } else if (arg.action === 'decrypt') {
    popupFileName = arg.filePath.replace('.enc', '');
  }
  let utils;
  try {
    const file = await dialog.showSaveDialog(
      {
        defaultPath: popupFileName,
      }
    );
    if (typeof file !== 'undefined') {
      utils = new Utils(arg.filePath, file.filePath, arg.passphrase);
      if (arg.action === 'encrypt') {
        info(`Encrypting ${file.filePath} with password <redacted>`);
        utils.encrypt();
        utils.on('progress', progress => {
          e.sender.send('notice-status', `Encrypting...${progress}%`);
        });
        utils.on('finished', () => {
          info('File successfully encrypted!');
          e.sender.send(
            'notice-status',
            `Done! File has been saved to: ${file.filePath}`,
          );
        });
      } else if (arg.action === 'decrypt') {
        info(`Decrypting ${file.filePath} with password <redacted>`);
        utils.decrypt();
        utils.on('progress', progress => {
          e.sender.send('notice-status', `Decrypting...${progress}%`);
        });
        utils.on('finished', () => {
          info('File successfully decrypted!');
          e.sender.send(
            'notice-status',
            `Done! File has been saved to: ${file.filePath}`,
          );
        });
        utils.on('error', reason => {
          if (reason === 'BAD_DECRYPT') {
            e.sender.send(
              'notice-status',
              'Oops. The passphrase is incorrect.',
            );
          }
        });
      }
    } else {
      warn('Destination file location not selected');
      e.sender.send(
        'notice-status',
        'Oops. Destination file location not selected. Please try again!',
      );
    }
  } catch(err) {
    error('Something went wrong', err);
    e.sender.send(
      'notice-status',
      'Oops. Something went wrong. Please reset and try again.',
    );
  }
});
