import { app, BrowserWindow, ipcMain } from 'electron';
import log from 'electron-log';
import path from 'path';

import { EVENT_DECRYPT, EVENT_ENCRYPT, EVENT_LOG } from '../constants';

const createWindow = (): BrowserWindow => {
  let mainWindow: BrowserWindow | null = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
    },
    icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
  });
  mainWindow.loadFile('dist/ui/index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  return mainWindow;
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

app.on('activate', () => {
  console.log('activate');
  createWindow();
});

ipcMain.on(EVENT_LOG, (e, arg) => {
  log.debug(arg);
});

// ipcMain.on(EVENT_ENCRYPT, async (e, arg) => {});

// ipcMain.on(EVENT_DECRYPT, async (e, arg) => {});
