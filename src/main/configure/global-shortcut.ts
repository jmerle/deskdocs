import { mainConfig } from '../config';
import { globalShortcutManager } from '../shortcuts/GlobalShortcutManager';
import { toggleWindow } from '../window';

// tslint:disable-next-line:no-var-requires
const isAccelerator = require('electron-is-accelerator');

function updateGlobalShortcut(): void {
  const globalShortcut = mainConfig.get('globalShortcut');
  const globalShortcutEnabled = mainConfig.get('globalShortcutEnabled');

  if (globalShortcut && globalShortcutEnabled && isAccelerator(globalShortcut)) {
    globalShortcutManager.registerShortcut({
      name: 'globalShortcut',
      accelerator: globalShortcut,
      action: () => toggleWindow(),
    });
  } else {
    globalShortcutManager.unregister('globalShortcut');
  }
}

export function configureGlobalShortcut(): void {
  updateGlobalShortcut();
  mainConfig.onChange('globalShortcut', () => updateGlobalShortcut());
  mainConfig.onChange('globalShortcutEnabled', () => updateGlobalShortcut());
}
