import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { is } from 'electron-util';
import * as path from 'path';
import * as url from 'url';
import { WindowType } from '../common/WindowType';
import { callRenderer } from './ipc';

export const windows: Map<WindowType, BrowserWindow> = new Map();

export function restoreWindow(window: BrowserWindow): void {
  if (window.isMinimized()) {
    window.restore();
  }

  window.show();
}

export async function createWindow(type: WindowType): Promise<void> {
  if (windows.has(type)) {
    restoreWindow(windows.get(type));
    return;
  }

  const options: BrowserWindowConstructorOptions = {
    icon: path.join(__static, 'icon.png'),
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  };

  if (type === WindowType.Preferences) {
    options.resizable = false;
    options.width = 400;
    options.height = 400;
  }

  const window = new BrowserWindow(options);
  windows.set(type, window);

  if (type === WindowType.Main) {
    window.maximize();

    if (is.development) {
      window.webContents.openDevTools({
        mode: 'bottom',
      });
    }
  } else {
    window.setMenuBarVisibility(false);

    window.on('ready-to-show', () => {
      window.show();
    });
  }

  window.on('closed', () => {
    windows.delete(type);

    if (type === WindowType.Main && windows.has(WindowType.Preferences)) {
      windows.get(WindowType.Preferences).close();
    }
  });

  if (is.development) {
    await window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    await window.loadURL(
      url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      }),
    );
  }

  await callRenderer(window, 'type', type);
}
