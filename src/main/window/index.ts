import { BrowserWindow } from 'electron';
import { is } from 'electron-util';
import * as path from 'path';
import * as url from 'url';
import { configureGlobalShortcut } from './global-shortcut';
import { configureLaunchOnBoot } from './launch-on-boot';
import { configureMenuVisibility } from './menu-visibility';
import { ShortcutManager } from './ShortcutManager';
import { configureSystemTheme } from './system-theme';
import { configureWindowShortcuts } from './window-shortcuts';

let mainWindow: BrowserWindow = null;

function configureWindow(): void {
  const shortcutManager = new ShortcutManager(mainWindow);

  configureLaunchOnBoot();
  configureWindowShortcuts(shortcutManager);
  configureGlobalShortcut(mainWindow, shortcutManager);
  configureMenuVisibility(mainWindow);
  configureSystemTheme();
}

export function restoreWindow(): void {
  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }

  mainWindow.show();
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

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  configureWindow();
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
