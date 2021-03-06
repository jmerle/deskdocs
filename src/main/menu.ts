import { app, BrowserWindow, Menu, MenuItemConstructorOptions, shell } from 'electron';
import { appMenu, debugInfo, is, openNewGitHubIssue, openUrlMenuItem } from 'electron-util';
import { REPO_NAME, REPO_OWNER } from '../common/constants';
import { callRenderer } from '../common/ipc';
import { mainConfig } from './config';

type MenuTemplate = Parameters<typeof Menu.buildFromTemplate>[0];

const helpSubmenu: MenuItemConstructorOptions = {
  role: 'help',
  submenu: [
    openUrlMenuItem({
      label: 'Source code',
      url: `https://github.com/${REPO_OWNER}/${REPO_NAME}`,
    }),
    {
      label: 'Report an issue…',
      click: () => {
        const body = `
<!-- Please succinctly describe your issue and steps to reproduce it. -->


---

${debugInfo()}`;

        openNewGitHubIssue({
          user: REPO_OWNER,
          repo: REPO_NAME,
          body,
        });
      },
    },
  ],
};

const debugSubmenu: MenuItemConstructorOptions = {
  label: 'Debug',
  submenu: [
    {
      label: 'Open settings in editor',
      click: () => {
        mainConfig.openInEditor();
      },
    },
    {
      label: 'Open app data',
      click: () => {
        shell.openItem(app.getPath('userData'));
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Delete settings and quit',
      click: () => {
        mainConfig.clear();
        app.quit();
      },
    },
    {
      label: 'Delete app data and quit',
      click: () => {
        shell.moveItemToTrash(app.getPath('userData'));
        app.quit();
      },
    },
  ],
};

const preferencesMenuItem: MenuItemConstructorOptions = {
  label: 'Preferences',
  accelerator: 'CommandOrControl+,',
  registerAccelerator: false,
  click: async () => {
    const window = BrowserWindow.getAllWindows()[0];
    if (window) {
      callRenderer(window, 'openPreferences');
    }
  },
};

const genericTemplate: MenuTemplate = [
  {
    role: 'fileMenu',
    submenu: [preferencesMenuItem, { type: 'separator' }, { role: 'quit' }],
  },
  { role: 'editMenu' },
  { role: 'viewMenu' },
  helpSubmenu,
];

const darwinTemplate: MenuTemplate = [
  appMenu([preferencesMenuItem]),
  { role: 'fileMenu' },
  { role: 'editMenu' },
  { role: 'viewMenu' },
  { role: 'windowMenu' },
  helpSubmenu,
];

const template = is.macos ? darwinTemplate : genericTemplate;

if (is.development) {
  template.push(debugSubmenu);
}

export const menu = Menu.buildFromTemplate(template);
