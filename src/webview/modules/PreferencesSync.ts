import { config } from '../../common/config';
import { Module } from './Module';

export class PreferencesSync extends Module {
  constructor() {
    super();

    this.initCookieWatching();
    this.initConfigWatching();
  }

  protected shouldActivate(pathname: string): boolean {
    return true;
  }

  private initCookieWatching(): void {
    const store = (window as any).cookieStore;

    store.addEventListener('change', (event: any) => {
      for (const cookie of event.changed) {
        const value = cookie.value === '1' ? true : cookie.value;
        config.set(cookie.name, value);
      }

      for (const cookie of event.deleted) {
        config.set(cookie.name, false);
      }
    });
  }

  private initConfigWatching(): void {
    //
  }
}
