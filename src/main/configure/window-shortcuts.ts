import { BrowserWindow } from 'electron';
import { WindowShortcutManager } from '../shortcuts/WindowShortcutManager';

export function configureWindowShortcuts(mainWindow: BrowserWindow): void {
  const shortcutManager = new WindowShortcutManager(mainWindow);

  shortcutManager.register('CommandOrControl+F', 'openInPageSearch');

  shortcutManager.register('CommandOrControl+T', 'addTab');
  shortcutManager.register('CommandOrControl+W', 'closeCurrentTab');

  for (let i = 0; i < 10; i++) {
    const shortcut = `CommandOrControl+${i}`;
    const data = {
      index: i === 0 ? 9 : i - 1,
    };

    shortcutManager.register(shortcut, 'showTab', data);
  }
}
