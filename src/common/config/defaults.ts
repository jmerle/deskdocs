import { is } from 'electron-util';

export const defaultConfig: any = {
  windowState: {
    x: 0,
    y: 0,
    width: 1280,
    height: 720,
    maximized: true,
  },

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
  hideMenuBar: false,
};
