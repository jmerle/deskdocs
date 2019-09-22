import { ipcRenderer } from 'electron';
import { OnAnyChangeCallback, OnChangeCallback } from '../../common/config/types';
import { webviewConfig } from '../config';

export abstract class Module {
  private activated = false;
  private firstNavigate = true;

  public update(pathname: string): void {
    this.activated = this.shouldActivate(pathname);

    if (this.activated) {
      if (this.firstNavigate) {
        this.firstNavigate = false;

        const css = this.getCssToInject();
        if (css !== null) {
          const link = document.createElement('link');
          link.setAttribute('rel', 'stylesheet');
          link.setAttribute('type', 'text/css');
          link.setAttribute('href', 'data:text/css;charset=UTF-8,' + encodeURIComponent(css));
          document.head.appendChild(link);
        }

        this.onFirstNavigate(pathname);
      }

      this.onNavigate(pathname);
    }
  }

  protected shouldActivate(pathname: string): boolean {
    return true;
  }

  protected onNavigate(pathname: string): void {
    // Let implementations override this
  }

  protected onFirstNavigate(pathname: string): void {
    // Let implementations override this
  }

  protected getCssToInject(): string {
    // Let implementations override this
    return null;
  }

  protected onConfigChange(key: string, cb: OnChangeCallback): void {
    webviewConfig.onChange(key, (newValue, oldValue) => {
      if (this.activated) {
        cb(newValue, oldValue);
      }
    });
  }

  protected onAnyConfigChange(cb: OnAnyChangeCallback): void {
    webviewConfig.onAnyChange((newValue, oldValue) => {
      if (this.activated) {
        cb(newValue, oldValue);
      }
    });
  }

  protected onRenderer(channel: string, callback: (data: any) => void): void {
    ipcRenderer.on(channel, (event, data) => {
      if (this.activated) {
        callback(data);
      }
    });
  }
}
