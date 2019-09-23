import { globalShortcut } from 'electron';
import { mainConfig } from '../config';
import { toggleWindow } from '../window';

// tslint:disable-next-line:no-var-requires
const isAccelerator = require('electron-is-accelerator');

let previousAccelerator: string = null;

function updateGlobalShortcut(): void {
  const accelerator = mainConfig.get('globalShortcut');
  const enabled = mainConfig.get('globalShortcutEnabled');

  if (accelerator && enabled && isAccelerator(accelerator)) {
    if (previousAccelerator !== null) {
      globalShortcut.unregister(previousAccelerator);
    }

    previousAccelerator = accelerator;
    globalShortcut.register(accelerator, () => toggleWindow());
  } else if (previousAccelerator !== null) {
    globalShortcut.unregister(previousAccelerator);
  }
}

export function configureGlobalShortcut(): void {
  updateGlobalShortcut();
  mainConfig.onChange('globalShortcut', () => updateGlobalShortcut());
  mainConfig.onChange('globalShortcutEnabled', () => updateGlobalShortcut());
}
