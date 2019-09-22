import { BrowserWindow } from 'electron';
import { mainConfig } from '../config';
import { restoreWindow } from './index';
import { ShortcutManager } from './ShortcutManager';

// tslint:disable-next-line:no-var-requires
const isAccelerator = require('electron-is-accelerator');

function updateGlobalShortcut(mainWindow: BrowserWindow, shortcutManager: ShortcutManager): void {
  const globalShortcut = mainConfig.get('globalShortcut');
  const globalShortcutEnabled = mainConfig.get('globalShortcutEnabled');

  if (globalShortcut && globalShortcutEnabled && isAccelerator(globalShortcut)) {
    console.log(globalShortcut);

    shortcutManager.registerShortcut({
      name: 'globalShortcut',
      accelerator: globalShortcut,
      global: true,
      action: () => {
        if (mainWindow.isFocused()) {
          mainWindow.minimize();
        } else {
          restoreWindow();
        }
      },
    });
  } else {
    shortcutManager.unregister('globalShortcut');
  }
}

export function configureGlobalShortcut(mainWindow: BrowserWindow, shortcutManager: ShortcutManager): void {
  updateGlobalShortcut(mainWindow, shortcutManager);
  mainConfig.onChange('globalShortcut', () => updateGlobalShortcut(mainWindow, shortcutManager));
  mainConfig.onChange('globalShortcutEnabled', () => updateGlobalShortcut(mainWindow, shortcutManager));
}
