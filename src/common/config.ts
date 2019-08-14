import { BrowserWindow } from 'electron';
import ElectronStore from 'electron-store';
import { answerMain, answerRenderer, callMain, callRenderer } from './ipc';

type OnChangeCallback<T> = (newValue: T | undefined, oldValue: T | undefined) => void;
type OnAnyChangeCallback<T> = (
  newValue: { [key: string]: T } | undefined,
  oldValue: { [key: string]: T } | undefined,
) => void;

/**
 * An improved version of ElectronStore which ensures onChange and onAnyChange
 * are called even if the config wasn't changed in the current process.
 */
class ImprovedElectronStore<T> extends ElectronStore<T> {
  private onChangeCallbacks: { [key: string]: Array<OnChangeCallback<T>> } = {};
  private onAnyChangeCallbacks: Array<OnAnyChangeCallback<T>> = [];

  private readonly keys: string[] = [];

  constructor(options: ElectronStore.Options<T> & { defaults: ElectronStore.Options<T>['defaults'] }) {
    super(options);

    this.keys = Object.keys(options.defaults);
  }

  public initMain(): void {
    answerRenderer('onChange', data => {
      BrowserWindow.getAllWindows().forEach(win => {
        callRenderer(win, 'onChange', data);
      });
    });

    answerRenderer('onAnyChange', data => {
      BrowserWindow.getAllWindows().forEach(win => {
        callRenderer(win, 'onAnyChange', data);
      });
    });
  }

  public initRenderer(): void {
    answerMain('onChange', data => {
      const callbacks = this.onChangeCallbacks[data.key];

      if (callbacks === undefined) {
        return;
      }

      for (const callback of callbacks) {
        callback(data.newValue, data.oldValue);
      }
    });

    answerMain('onAnyChange', data => {
      for (const callback of this.onAnyChangeCallbacks) {
        callback(data.newValue, data.oldValue);
      }
    });

    for (const key of this.keys) {
      this.onDidChange(key, (newValue, oldValue) => {
        callMain('onChange', {
          key,
          newValue,
          oldValue,
        } as any);
      });
    }

    this.onDidAnyChange((newValue, oldValue) => {
      callMain('onAnyChange', {
        newValue,
        oldValue,
      } as any);
    });
  }

  public onChange(key: string, callback: OnChangeCallback<T>): void {
    if (this.onChangeCallbacks[key] === undefined) {
      this.onChangeCallbacks[key] = [];
    }

    this.onChangeCallbacks[key].push(callback);
  }

  public onAnyChange(callback: OnAnyChangeCallback<T>): void {
    this.onAnyChangeCallbacks.push(callback);
  }
}

export const config = new ImprovedElectronStore<any>({
  defaults: {
    darkMode: false,
    globalShortcut: 'CommandOrControl+Shift+D',
    globalShortcutEnabled: false,
  },
});
