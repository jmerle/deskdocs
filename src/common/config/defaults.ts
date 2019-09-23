import { is } from 'electron-util';

export const defaultConfig: any = {
  dark: false,
  useSystemTheme: is.macos,

  globalShortcut: 'CommandOrControl+Shift+D',
  globalShortcutEnabled: true,

  launchOnBoot: false,
  launchToTray: false,

  showSingleTab: false,
  autoRestore: false,

  hideMenuBar: !is.macos,
};
