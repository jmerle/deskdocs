import { app, Menu, Tray } from 'electron';
import { is } from 'electron-util';
import * as path from 'path';
import { startQuitting } from '../utils/state';
import { createOrRestoreWindow } from '../window';

let tray: Tray = null;

export function configureTray(): void {
  const trayIconSize = is.macos ? 16 : 64;

  tray = new Tray(path.resolve(__static, `${trayIconSize}x${trayIconSize}.png`));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open DeskDocs',
      click: () => createOrRestoreWindow(),
    },
    {
      type: 'separator',
    },
    {
      label: 'Quit DeskDocs',
      click: () => {
        startQuitting();
        app.quit();
      },
    },
  ]);

  tray.on('click', () => createOrRestoreWindow());

  tray.setContextMenu(contextMenu);
}
