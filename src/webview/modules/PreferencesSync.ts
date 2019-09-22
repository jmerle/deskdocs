import { defaultConfig } from '../../common/config/defaults';
import { webviewConfig } from '../config';
import { Module } from './Module';

export class PreferencesSync extends Module {
  protected onFirstNavigate(pathname: string): void {
    this.initCookieWatching();
    this.initConfigWatching();
  }

  private initCookieWatching(): void {
    const store = (window as any).cookieStore;

    store.addEventListener('change', (event: any) => {
      for (const cookie of event.changed) {
        const value = cookie.value === '1' ? true : cookie.value;
        webviewConfig.set(cookie.name, value);
      }

      for (const cookie of event.deleted) {
        const value = typeof defaultConfig[cookie.name] === 'string' ? '' : false;
        webviewConfig.set(cookie.name, value);
      }
    });
  }

  private initConfigWatching(): void {
    this.onConfigChange('dark', (newValue: boolean) => {
      app.settings.toggleDark(newValue);
    });

    this.onConfigChange('layout', (newValue: string) => {
      for (const layout of app.settings.LAYOUTS) {
        app.settings.setLayout(layout, (newValue || '').includes(layout));
      }
    });

    this.onConfigChange('docs', () => {
      app.reload();
    });
  }
}
