import { is } from 'electron-util';
import { ShortcutManager } from './ShortcutManager';

export function configureWindowShortcuts(shortcutManager: ShortcutManager): void {
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
