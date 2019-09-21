import { webviewConfig } from '../config';
import { Module } from './Module';

export class PreferencesSync extends Module {
  constructor() {
    super();

    this.initCookieWatching();
  }

  protected shouldActivate(pathname: string): boolean {
    return true;
  }

  private initCookieWatching(): void {
    const store = (window as any).cookieStore;

    store.addEventListener('change', (event: any) => {
      for (const cookie of event.changed) {
        const value = cookie.value === '1' ? true : cookie.value;
        webviewConfig.set(cookie.name, value);
      }

      for (const cookie of event.deleted) {
        webviewConfig.set(cookie.name, false);
      }
    });
  }
}
