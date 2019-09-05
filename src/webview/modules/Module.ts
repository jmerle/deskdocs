import { config, OnAnyChangeCallback, OnChangeCallback } from '../../common/config';

export abstract class Module {
  private activated = false;

  protected abstract shouldActivate(pathname: string): boolean;

  public update(pathname: string): void {
    this.activated = this.shouldActivate(pathname);

    if (this.activated) {
      this.onNavigate(pathname);
    }
  }

  protected onNavigate(pathname: string): void {
    // Let implementations override this
  }

  protected onConfigChange(key: string, cb: OnChangeCallback<any>): void {
    config.onChange(key, (newValue, oldValue) => {
      if (this.activated) {
        cb(newValue, oldValue);
      }
    });
  }

  protected onAnyConfigChange(cb: OnAnyChangeCallback<any>): void {
    config.onAnyChange((newValue, oldValue) => {
      if (this.activated) {
        cb(newValue, oldValue);
      }
    });
  }
}
