import { mainConfig } from '../config';
import { globalShortcutManager } from '../shortcuts/GlobalShortcutManager';
import { toggleWindow } from '../window';

// tslint:disable-next-line:no-var-requires
const isAccelerator = require('electron-is-accelerator');

let previousGlobalShortcut: string = null;

function updateGlobalShortcut(): void {
  const globalShortcut = mainConfig.get('globalShortcut');
  const globalShortcutEnabled = mainConfig.get('globalShortcutEnabled');

  if (globalShortcut && globalShortcutEnabled && isAccelerator(globalShortcut)) {
    if (previousGlobalShortcut !== null) {
      globalShortcutManager.unregister(previousGlobalShortcut);
    }

    previousGlobalShortcut = globalShortcut;
    globalShortcutManager.registerShortcut(globalShortcut, () => toggleWindow());
  } else if (previousGlobalShortcut !== null) {
    globalShortcutManager.unregister(previousGlobalShortcut);
  }
}

export function configureGlobalShortcut(): void {
  updateGlobalShortcut();
  mainConfig.onChange('globalShortcut', () => updateGlobalShortcut());
  mainConfig.onChange('globalShortcutEnabled', () => updateGlobalShortcut());
}
