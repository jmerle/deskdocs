import { systemPreferences } from 'electron';
import { is } from 'electron-util';
import { mainConfig } from '../config';

export function configureSystemTheme(): void {
  if (is.macos) {
    const updateBySystemTheme = () => {
      if (mainConfig.get('useSystemTheme')) {
        mainConfig.set('dark', systemPreferences.isDarkMode());
      }
    };

    updateBySystemTheme();
    systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', () => updateBySystemTheme());
    mainConfig.onChange('dark', () => updateBySystemTheme());
    mainConfig.onChange('useSystemTheme', () => updateBySystemTheme());
  }
}
