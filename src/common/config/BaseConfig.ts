import ElectronStore from 'electron-store';
import {
  ConfigEvent,
  OnAnyChangeCallback,
  OnAnyChangeEvent,
  OnChangeCallback,
  OnChangeEvent,
  OnChangeKeyEvent,
} from './config-types';

export abstract class BaseConfig extends ElectronStore<any> {
  protected eventChannel = 'configEvent';

  private onChangeCallbacks: Map<string, OnChangeCallback[]> = new Map();
  private onAnyChangeCallbacks: OnAnyChangeCallback[] = [];
  private knownOnChangeKeys: string[] = [];

  constructor() {
    super({
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

    (this as any).events.setMaxListeners(50);
  }

  protected abstract initListeners(): void;

  protected abstract sendEvent(event: ConfigEvent): void;

  public init(): void {
    this.onDidAnyChange((newValue, oldValue) => {
      this.sendEvent({
        type: 'onAnyChange',
        payload: {
          newValue,
          oldValue,
        },
      });
    });

    this.initListeners();
  }

  public onChange(key: string, callback: OnChangeCallback): void {
    this.sendEvent({
      type: 'onChangeKey',
      payload: {
        key,
      },
    });

    if (!this.onChangeCallbacks.has(key)) {
      this.onChangeCallbacks.set(key, []);
    }

    this.onChangeCallbacks.get(key).push(callback);
  }

  public onAnyChange(callback: OnAnyChangeCallback): void {
    this.onAnyChangeCallbacks.push(callback);
  }

  protected handleEvent(event: ConfigEvent): void {
    switch (event.type) {
      case 'onChange':
        this.handleOnChange(event);
        break;
      case 'onAnyChange':
        this.handleOnAnyChange(event);
        break;
      case 'onChangeKey':
        this.handleOnChangeKeyEvent(event);
        break;
    }
  }

  private handleOnChange(event: OnChangeEvent): void {
    const { key, newValue, oldValue } = event.payload;

    for (const callback of this.onChangeCallbacks.get(key) || []) {
      callback(newValue, oldValue);
    }
  }

  private handleOnAnyChange(event: OnAnyChangeEvent): void {
    const { newValue, oldValue } = event.payload;

    for (const callback of this.onAnyChangeCallbacks) {
      callback(newValue, oldValue);
    }
  }

  private handleOnChangeKeyEvent(event: OnChangeKeyEvent): void {
    const { key } = event.payload;

    if (this.knownOnChangeKeys.includes(key)) {
      return;
    }

    this.onDidChange(key, (newValue, oldValue) => {
      this.sendEvent({
        type: 'onChange',
        payload: {
          key,
          newValue,
          oldValue,
        },
      });
    });

    this.knownOnChangeKeys.push(key);
  }
}
