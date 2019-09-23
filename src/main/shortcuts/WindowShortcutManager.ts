import { Accelerator, BrowserWindow, globalShortcut } from 'electron';
import { callRenderer } from '../../common/ipc';
import { ShortcutManager } from './ShortcutManager';

export class WindowShortcutManager extends ShortcutManager {
  constructor(private win: BrowserWindow) {
    super();

    this.win.on('focus', () => {
      for (const accelerator of this.shortcuts.keys()) {
        globalShortcut.register(accelerator, () => this.shortcuts.get(accelerator)());
      }
    });

    this.win.on('blur', () => {
      for (const accelerator of this.shortcuts.keys()) {
        globalShortcut.unregister(accelerator);
      }
    });
  }

  protected shouldUnregisterExistingShortcut(): boolean {
    return this.win.isFocused();
  }

  protected shouldRegisterNewShortcut(): boolean {
    return this.win.isFocused();
  }

  public register(accelerator: Accelerator, name: string, data?: any): void {
    this.registerShortcut(accelerator, () => callRenderer(this.win, name, data));
  }
}
