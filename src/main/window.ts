import { Accelerator, BrowserWindow, globalShortcut } from 'electron';
import { is } from 'electron-util';
import * as path from 'path';
import * as url from 'url';
import { answerRenderer, callRenderer } from '../common/ipc';
import { mainConfig } from './config';

let mainWindow: BrowserWindow = null;

function registerWindowShortcut(window: BrowserWindow, shortcut: Accelerator, message: string, data: any = {}): void {
  window.on('focus', () => {
    globalShortcut.register(shortcut, async () => {
      await callRenderer(window, message, data);
    });
  });

  window.on('blur', () => {
    globalShortcut.unregister(shortcut);
  });
}

function restoreWindow(window: BrowserWindow): void {
  if (window.isMinimized()) {
    window.restore();
  }

  window.show();
}

function configureWindow(window: BrowserWindow): void {
  window.setMaxListeners(15);

  registerWindowShortcut(window, 'CommandOrControl+T', 'addTab');
  registerWindowShortcut(window, 'CommandOrControl+W', 'closeCurrentTab');

  for (let i = 0; i < 10; i++) {
    const shortcut = `${is.macos ? 'Command' : 'Alt'}+${i}`;
    const data = {
      index: i === 0 ? 9 : i - 1,
    };

    registerWindowShortcut(window, shortcut, 'showTab', data);
  }

  const globalShortcutCallback = () => {
    if (window.isFocused()) {
      window.minimize();
    } else {
      restoreWindow(window);
    }
  };

  let currentGlobalShortcut: Accelerator = mainConfig.get('globalShortcut') as Accelerator;
  globalShortcut.register(currentGlobalShortcut, globalShortcutCallback);

  answerRenderer('updateGlobalShortcut', (newShortcut: Accelerator) => {
    globalShortcut.unregister(currentGlobalShortcut);
    currentGlobalShortcut = newShortcut;
    globalShortcut.register(currentGlobalShortcut, globalShortcutCallback);
  });

  registerWindowShortcut(window, 'CommandOrControl+F', 'openInPageSearch');
}

export async function createOrRestoreWindow(): Promise<void> {
  if (mainWindow !== null) {
    restoreWindow(mainWindow);
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

  configureWindow(mainWindow);
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
