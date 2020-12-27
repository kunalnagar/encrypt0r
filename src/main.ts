import { app, BrowserWindow } from 'electron';

const createWindow = (): void => {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('index.html');
}

try {
  require('electron-reloader')(module)
} catch (_) {}

app.on('ready', createWindow);
