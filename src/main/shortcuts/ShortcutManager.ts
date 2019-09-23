import { Accelerator, globalShortcut } from 'electron';

export interface Shortcut {
  name: string;
  accelerator: Accelerator;
  action: () => void;
}

export abstract class ShortcutManager<T extends Shortcut> {
  protected shortcuts: Map<string, T> = new Map();

  protected abstract shouldUnregisterExistingShortcut(): boolean;

  protected abstract shouldRegisterNewShortcut(): boolean;

  public registerShortcut(shortcut: T): void {
    if (this.shortcuts.has(shortcut.name) && this.shouldUnregisterExistingShortcut()) {
      this.unregisterGlobalShortcut(this.shortcuts.get(shortcut.name));
    }

    this.shortcuts.set(shortcut.name, shortcut);

    if (this.shouldRegisterNewShortcut()) {
      this.registerGlobalShortcut(this.shortcuts.get(shortcut.name));
    }
  }

  public unregister(name: string): void {
    if (this.shortcuts.has(name) && this.shouldUnregisterExistingShortcut()) {
      this.unregisterGlobalShortcut(this.shortcuts.get(name));
    }

    this.shortcuts.delete(name);
  }

  protected registerGlobalShortcut(shortcut: T): void {
    globalShortcut.register(shortcut.accelerator, () => {
      shortcut.action();
    });
  }

  protected unregisterGlobalShortcut(shortcut: T): void {
    globalShortcut.unregister(shortcut.accelerator);
  }
}
