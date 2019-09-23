import { Accelerator, BrowserWindow } from 'electron';
import { callRenderer } from '../../common/ipc';
import { Shortcut, ShortcutManager } from './ShortcutManager';

export interface WindowShortcut extends Shortcut {
  data?: any;
}

export class WindowShortcutManager extends ShortcutManager<WindowShortcut> {
  constructor(private win: BrowserWindow) {
    super();

    this.win.on('focus', () => {
      for (const shortcut of this.shortcuts.values()) {
        this.registerGlobalShortcut(shortcut);
      }
    });

    this.win.on('blur', () => {
      for (const shortcut of this.shortcuts.values()) {
        this.unregisterGlobalShortcut(shortcut);
      }
    });
  }

  protected shouldUnregisterExistingShortcut(): boolean {
    return this.win.isFocused();
  }

  protected shouldRegisterNewShortcut(): boolean {
    return this.win.isFocused();
  }

  public register(name: string, accelerator: Accelerator, data?: any): void {
    this.registerShortcut({
      name,
      accelerator,
      data,
      action: () => {
        callRenderer(this.win, name, data);
      },
    });
  }
}
