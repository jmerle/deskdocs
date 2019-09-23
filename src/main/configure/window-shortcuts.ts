import { BrowserWindow } from 'electron';
import { is } from 'electron-util';
import { WindowShortcutManager } from '../shortcuts/WindowShortcutManager';

export function configureWindowShortcuts(mainWindow: BrowserWindow): void {
  const shortcutManager = new WindowShortcutManager(mainWindow);

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
}
