import { systemPreferences } from 'electron';
import { is } from 'electron-util';
import { mainConfig } from '../config';

function updateSystemTheme(): void {
  if (mainConfig.get('useSystemTheme')) {
    let darkMode = false;

    if (is.macos) {
      darkMode = systemPreferences.isDarkMode();
    }

    if (is.windows) {
      darkMode = systemPreferences.isInvertedColorScheme();
    }

    mainConfig.set('dark', darkMode);
  }
}

export function configureSystemTheme(): void {
  if (is.macos || is.windows) {
    updateSystemTheme();

    if (is.macos) {
      systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', () => updateSystemTheme());
    }

    if (is.windows) {
      systemPreferences.on('inverted-color-scheme-changed', () => updateSystemTheme());
    }

    mainConfig.onChange('dark', () => updateSystemTheme());
    mainConfig.onChange('useSystemTheme', () => updateSystemTheme());
  }
}
