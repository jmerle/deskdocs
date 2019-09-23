import { Accelerator, BrowserWindow, globalShortcut } from 'electron';
import { callRenderer } from '../../common/ipc';

type Callback = () => void;

export class ShortcutManager {
  private shortcuts: Map<Accelerator, Callback> = new Map();

  constructor(private win: BrowserWindow) {
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

  public register(accelerator: Accelerator, name: string, data?: any): void {
    if (this.shortcuts.has(accelerator) && this.win.isFocused()) {
      globalShortcut.unregister(accelerator);
    }

    const callback = () => callRenderer(this.win, name, data);
    this.shortcuts.set(accelerator, callback);

    if (this.win.isFocused()) {
      globalShortcut.register(accelerator, () => callback());
    }
  }

  public unregister(accelerator: Accelerator): void {
    if (this.shortcuts.has(accelerator) && this.win.isFocused()) {
      globalShortcut.unregister(accelerator);
    }

    this.shortcuts.delete(accelerator);
  }
}
