import { app, Menu, Tray } from 'electron';
import * as path from 'path';
import { startQuitting } from '../quit';
import { createOrRestoreWindow } from '../window';

let tray: Tray = null;

export function configureTray(): void {
  tray = new Tray(path.resolve(__static, 'icon.png'));

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
