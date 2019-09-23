import { app, BrowserWindow } from 'electron';
import { is } from 'electron-util';
import * as path from 'path';
import * as url from 'url';
import { configureMenuVisibility } from './configure/menu-visibility';
import { configureWindowShortcuts } from './configure/window-shortcuts';
import { isQuitting } from './utils/state';

let mainWindow: BrowserWindow = null;

export function restoreWindow(): void {
  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }

  mainWindow.show();
}

export function toggleWindow(): void {
  if (mainWindow === null) {
    createOrRestoreWindow();
  } else if (mainWindow.isFocused()) {
    mainWindow.minimize();
  } else {
    restoreWindow();
  }
}

export async function createOrRestoreWindow(): Promise<void> {
  if (mainWindow !== null) {
    restoreWindow();
    return;
  }

  mainWindow = new BrowserWindow({
    icon: path.join(__static, 'icon.png'),
    show: false,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
    },
  });

  mainWindow.on('close', (event: Event) => {
    if (!isQuitting()) {
      event.preventDefault();

      if (is.macos) {
        app.hide();
      } else {
        mainWindow.hide();
      }
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  configureWindowShortcuts(mainWindow);
  configureMenuVisibility(mainWindow);

  mainWindow.maximize();

  if (is.development) {
    await mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    await mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      }),
    );
  }
}
