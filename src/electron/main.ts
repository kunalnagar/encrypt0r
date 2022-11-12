/* eslint-disable @typescript-eslint/no-explicit-any */
import { app, BrowserWindow, dialog, ipcMain, IpcMainEvent } from 'electron';
import log from 'electron-log';

import Crypto from '../business-logic/Crypto';
import {
  EVENT_DECRYPT,
  EVENT_DESTINATION_STREAM_FINISH,
  EVENT_ENCRYPT,
  EVENT_LOG,
  EVENT_NOTICE,
  EVENT_SOURCE_STREAM_PROGRESS,
} from '../constants';

const createWindow = (): BrowserWindow => {
  let mainWindow: BrowserWindow | null = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile('dist/ui/index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  return mainWindow;
};

const handleMode = async (eventName: string, event: IpcMainEvent, arg: any) => {
  const sourceFilePath = arg.filePath as string;
  let destinationFilePath = `${arg.filePath as string}`;
  const passphrase = arg.passphrase as string;
  let verb = '';
  if (eventName === EVENT_ENCRYPT) {
    verb = 'Encrypting';
    destinationFilePath += '.enc';
  } else if (eventName === EVENT_DECRYPT) {
    verb = 'Decrypting';
    destinationFilePath = destinationFilePath.replace('.enc', '');
  }
  const file = await dialog.showSaveDialog({
    defaultPath: destinationFilePath,
  });
  if (!file.canceled) {
    const crypto = new Crypto(
      sourceFilePath,
      file.filePath as string,
      passphrase,
    );
    if (eventName === EVENT_ENCRYPT) {
      crypto.encrypt();
    } else {
      crypto.decrypt();
    }
    crypto.on(EVENT_NOTICE, (data) => {
      event.sender.send(EVENT_NOTICE, data);
    });
    crypto.on(EVENT_SOURCE_STREAM_PROGRESS, (progress) => {
      event.sender.send(EVENT_NOTICE, `${verb}...${progress}%`);
    });
    crypto.on(EVENT_DESTINATION_STREAM_FINISH, () => {
      event.sender.send(
        EVENT_NOTICE,
        `Done! File has been saved to: ${file.filePath}`,
      );
    });
  }
};

app.on('ready', () => {
  console.log('ready');
  createWindow();
});

app.on('window-all-closed', () => {
  console.log('window-all-closed', process.platform);
  if (process.platform === 'darwin') {
    app.quit();
  }
});

ipcMain.on(EVENT_LOG, (e, arg) => {
  log.debug(arg);
});

ipcMain.on(EVENT_ENCRYPT, async (e, arg) => {
  handleMode(EVENT_ENCRYPT, e, arg);
});

ipcMain.on(EVENT_DECRYPT, async (e, arg) => {
  handleMode(EVENT_DECRYPT, e, arg);
});
