import { app, BrowserWindow } from 'electron';
import { is } from 'electron-util';
import * as path from 'path';
import * as url from 'url';
import { mainConfig } from './config';
import { configureMenuVisibility } from './configure/menu-visibility';
import { configureWindowShortcuts } from './configure/window-shortcuts';
import { configureWindowState } from './configure/window-state';
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

  const windowState = mainConfig.get('windowState');

  mainWindow = new BrowserWindow({
    icon: path.join(__static, '64x64.png'),
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
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

  configureWindowState(mainWindow);
  configureWindowShortcuts(mainWindow);
  configureMenuVisibility(mainWindow);

  if (windowState.maximized) {
    mainWindow.maximize();
  } else {
    mainWindow.show();
  }

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
