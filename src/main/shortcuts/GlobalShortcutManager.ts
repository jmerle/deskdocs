import { Shortcut, ShortcutManager } from './ShortcutManager';

class GlobalShortcutManager extends ShortcutManager<Shortcut> {
  protected shouldUnregisterExistingShortcut(): boolean {
    return true;
  }

  protected shouldRegisterNewShortcut(): boolean {
    return true;
  }
}

export const globalShortcutManager = new GlobalShortcutManager();
