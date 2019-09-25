import { Module } from './Module';

export class PreferencesMenuItem extends Module {
  protected onFirstNavigate(pathname: string): void {
    this.onRenderer('openPreferences', () => {
      const event: any = new Event('keydown');
      event.ctrlKey = true;
      event.which = 188;

      document.dispatchEvent(event);
    });
  }
}
