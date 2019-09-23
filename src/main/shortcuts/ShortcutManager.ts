import { Accelerator, globalShortcut } from 'electron';

type Callback = () => void;

export abstract class ShortcutManager {
  protected shortcuts: Map<Accelerator, Callback> = new Map();

  protected abstract shouldUnregisterExistingShortcut(): boolean;

  protected abstract shouldRegisterNewShortcut(): boolean;

  public registerShortcut(accelerator: Accelerator, callback: Callback): void {
    if (this.shortcuts.has(accelerator) && this.shouldUnregisterExistingShortcut()) {
      globalShortcut.unregister(accelerator);
    }

    this.shortcuts.set(accelerator, callback);

    if (this.shouldRegisterNewShortcut()) {
      globalShortcut.register(accelerator, () => callback());
    }
  }

  public unregister(accelerator: Accelerator): void {
    if (this.shortcuts.has(accelerator) && this.shouldUnregisterExistingShortcut()) {
      globalShortcut.unregister(accelerator);
    }

    this.shortcuts.delete(accelerator);
  }
}
