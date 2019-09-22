import { defaultConfig } from '../../common/config/defaults';
import { Module } from './Module';

export class PreferenceActions extends Module {
  protected onFirstNavigate(pathname: string): void {
    this.patchResetSettings();
    this.patchImportSettings();
  }

  private patchResetSettings(): void {
    const originalReset = app.settings.reset;
    app.settings.reset = function(): any {
      const result = originalReset.apply(this, arguments);

      for (const key of Object.keys(defaultConfig)) {
        app.settings.set(key, defaultConfig[key]);
      }

      return result;
    };
  }

  private patchImportSettings(): void {
    const originalImport = app.settings.import;
    app.settings.import = function(): any {
      const result = originalImport.apply(this, arguments);

      for (const key of Object.keys(arguments[0])) {
        if (defaultConfig[key] !== undefined) {
          app.settings.set(key, arguments[0][key]);
        }
      }

      return result;
    };
  }
}
