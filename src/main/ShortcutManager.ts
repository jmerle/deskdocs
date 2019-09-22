import { Accelerator, BrowserWindow, globalShortcut } from 'electron';
import { callRenderer } from '../common/ipc';

export interface Shortcut {
  name: string;
  accelerator: Accelerator;
  data?: any;
  global: boolean;
  action: () => void;
}

export class ShortcutManager {
  private shortcuts: Map<string, Shortcut> = new Map();

  constructor(private win: BrowserWindow) {
    this.win.on('focus', () => {
      for (const shortcut of this.shortcuts.values()) {
        if (!shortcut.global) {
          this.registerGlobalShortcut(shortcut);
        }
      }
    });

    this.win.on('blur', () => {
      for (const shortcut of this.shortcuts.values()) {
        if (!shortcut.global) {
          this.unregisterGlobalShortcut(shortcut);
        }
      }
    });
  }

  public registerShortcut(shortcut: Shortcut): void {
    if (this.shortcuts.has(shortcut.name) && this.win.isFocused()) {
      this.unregisterGlobalShortcut(this.shortcuts.get(shortcut.name));
    }

    this.shortcuts.set(shortcut.name, shortcut);

    if (this.win.isFocused() || shortcut.global) {
      this.registerGlobalShortcut(this.shortcuts.get(shortcut.name));
    }
  }

  public register(name: string, accelerator: Accelerator, data?: any): void {
    this.registerShortcut({
      name,
      accelerator,
      data,
      global: false,
      action: () => {
        callRenderer(this.win, name, data);
      },
    });
  }

  public unregister(name: string): void {
    if (this.shortcuts.has(name) && this.win.isFocused()) {
      this.unregisterGlobalShortcut(this.shortcuts.get(name));
    }

    this.shortcuts.delete(name);
  }

  private registerGlobalShortcut(shortcut: Shortcut): void {
    globalShortcut.register(shortcut.accelerator, () => {
      shortcut.action();
    });
  }

  private unregisterGlobalShortcut(shortcut: Shortcut): void {
    globalShortcut.unregister(shortcut.accelerator);
  }
}
