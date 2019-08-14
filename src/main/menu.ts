import { app, Menu, MenuItemConstructorOptions, shell } from 'electron';
import { appMenu, debugInfo, is, openNewGitHubIssue, openUrlMenuItem } from 'electron-util';
import { config } from '../common/config';
import { REPO_NAME, REPO_OWNER } from '../common/constants';

type MenuTemplate = Parameters<typeof Menu.buildFromTemplate>[0];
type SubmenuTemplate = MenuItemConstructorOptions['submenu'];

const helpSubmenu: SubmenuTemplate = [
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
];

const debugSubmenu: SubmenuTemplate = [
  {
    label: 'Open settings in editor',
    click: () => {
      config.openInEditor();
    },
  },
  {
    label: 'Open App Data',
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
      config.clear();
      app.quit();
    },
  },
  {
    label: 'Delete App Data and quit',
    click: () => {
      shell.moveItemToTrash(app.getPath('userData'));
      app.quit();
    },
  },
];

const preferencesMenuItem: MenuItemConstructorOptions = {
  label: 'Preferences',
  accelerator: 'CommandOrControl+,',
  registerAccelerator: false,
  click: async () => {
    // TODO
  },
};

const genericTemplate: MenuTemplate = [
  {
    role: 'fileMenu',
    submenu: [preferencesMenuItem, { type: 'separator' }, { role: 'quit' }],
  },
  { role: 'editMenu' },
  { role: 'viewMenu' },
  {
    role: 'help',
    submenu: helpSubmenu,
  },
];

const darwinTemplate: MenuTemplate = [
  appMenu([preferencesMenuItem]),
  { role: 'fileMenu' },
  { role: 'editMenu' },
  { role: 'viewMenu' },
  { role: 'windowMenu' },
  {
    role: 'help',
    submenu: helpSubmenu,
  },
];

const template = is.macos ? darwinTemplate : genericTemplate;

if (is.development) {
  template.push({
    label: 'Debug',
    submenu: debugSubmenu,
  });
}

export const menu = Menu.buildFromTemplate(template);
