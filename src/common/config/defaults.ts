import { is } from 'electron-util';

export const defaultConfig: any = {
  dark: false,
  useSystemTheme: is.macos,

  globalShortcut: 'CommandOrControl+Shift+D',
  globalShortcutEnabled: true,

  launchOnBoot: false,
  launchToTray: false,

  autoRestore: false,
  autoRestorePathnames: [],
  autoRestoreCurrentTab: -1,

  showSingleTab: false,
  hideMenuBar: !is.macos,
};
