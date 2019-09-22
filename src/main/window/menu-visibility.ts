import { BrowserWindow } from 'electron';
import { is } from 'electron-util';
import { mainConfig } from '../config';

function updateMenuVisibility(mainWindow: BrowserWindow): void {
  const hidden = mainConfig.get('hideMenuBar');
  mainWindow.setAutoHideMenuBar(hidden);
  mainWindow.setMenuBarVisibility(!hidden);
}

export function configureMenuVisibility(mainWindow: BrowserWindow): void {
  if (!is.macos) {
    updateMenuVisibility(mainWindow);
    mainConfig.onChange('hideMenuBar', () => updateMenuVisibility(mainWindow));
  }
}
