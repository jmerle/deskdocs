import { BrowserWindow, systemPreferences } from 'electron';
import { is } from 'electron-util';
import * as path from 'path';
import * as url from 'url';
import { mainConfig } from './config';
import { ShortcutManager } from './ShortcutManager';

let mainWindow: BrowserWindow = null;

function restoreWindow(window: BrowserWindow): void {
  if (window.isMinimized()) {
    window.restore();
  }

  window.show();
}

function configureWindow(window: BrowserWindow): void {
  window.setMaxListeners(15);

  const shortcutManager = new ShortcutManager(window);

  shortcutManager.register('openInPageSearch', 'CommandOrControl+F');

  shortcutManager.register('addTab', 'CommandOrControl+T');
  shortcutManager.register('closeCurrentTab', 'CommandOrControl+W');

  for (let i = 0; i < 10; i++) {
    const shortcut = `${is.macos ? 'Command' : 'Alt'}+${i}`;
    const data = {
      index: i === 0 ? 9 : i - 1,
    };

    shortcutManager.register('showTab', shortcut, data);
  }

  const updateGlobalShortcut = () => {
    const globalShortcut = mainConfig.get('globalShortcut');
    const globalShortcutEnabled = mainConfig.get('globalShortcutEnabled');

    if (globalShortcutEnabled) {
      shortcutManager.registerShortcut({
        name: 'globalShortcut',
        accelerator: globalShortcut,
        global: true,
        action: () => {
          if (window.isFocused()) {
            window.minimize();
          } else {
            restoreWindow(window);
          }
        },
      });
    } else {
      shortcutManager.unregister('globalShortcut');
    }
  };

  updateGlobalShortcut();
  mainConfig.onChange('globalShortcut', () => updateGlobalShortcut());
  mainConfig.onChange('globalShortcutEnabled', () => updateGlobalShortcut());

  if (is.macos) {
    const updateBySystemTheme = () => {
      if (mainConfig.get('useSystemTheme')) {
        mainConfig.set('dark', systemPreferences.isDarkMode());
      }
    };

    updateBySystemTheme();
    systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', () => updateBySystemTheme());
    mainConfig.onChange('dark', () => updateBySystemTheme());
  }
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
