import { BrowserWindow, WebviewTag } from 'electron';
import { ipcRenderer } from 'electron-better-ipc';
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

  public readonly keys: string[] = [];

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
      document.querySelectorAll<WebviewTag>('webview').forEach(webview => {
        webview.send('onChange', data);
      });

      this.handleRendererOnChange(data);
    });

    answerMain('onAnyChange', data => {
      document.querySelectorAll<WebviewTag>('webview').forEach(webview => {
        webview.send('onAnyChange', data);
      });

      this.handleRendererOnAnyChange(data);
    });

    this.setUpRendererEvents(callMain);
  }

  public initWebviewTag(webview: WebviewTag): void {
    webview.addEventListener('ipc-message', data => {
      callMain(data.channel, ...data.args);
    });
  }

  public initWebview(): void {
    ipcRenderer.on('onChange', (event, data) => {
      this.handleRendererOnChange(data);
    });

    ipcRenderer.on('onAnyChange', (event, data) => {
      this.handleRendererOnAnyChange(data);
    });

    this.setUpRendererEvents(ipcRenderer.sendToHost);
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

  private setUpRendererEvents(sendFunc: typeof callMain): void {
    for (const key of this.keys) {
      this.onDidChange(key, (newValue, oldValue) => {
        sendFunc('onChange', {
          key,
          newValue,
          oldValue,
        } as any);
      });
    }

    this.onDidAnyChange((newValue, oldValue) => {
      sendFunc('onAnyChange', {
        newValue,
        oldValue,
      } as any);
    });
  }

  private handleRendererOnChange(data: any): void {
    const callbacks = this.onChangeCallbacks[data.key];

    if (callbacks === undefined) {
      return;
    }

    for (const callback of callbacks) {
      callback(data.newValue, data.oldValue);
    }
  }

  private handleRendererOnAnyChange(data: any): void {
    for (const callback of this.onAnyChangeCallbacks) {
      callback(data.newValue, data.oldValue);
    }
  }
}

export const config = new ImprovedElectronStore<any>({
  defaults: {
    dark: false,

    globalShortcut: 'CommandOrControl+Shift+D',
    globalShortcutEnabled: true,

    launchOnBoot: false,
    startMinimized: false,

    showSingleTab: false,
    autoRestore: false,
  },
});
