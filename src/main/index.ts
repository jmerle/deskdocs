import { app, Menu } from 'electron';
import * as unhandled from 'electron-unhandled';
import { debugInfo, openNewGitHubIssue } from 'electron-util';
import { WindowType } from '../common/WindowType';
import { menu } from './menu';
import { createWindow, restoreWindow, windows } from './windows';

declare global {
  // https://webpack.electron.build/using-static-assets
  // tslint:disable-next-line:variable-name
  const __static: string;
}

// Disabling security warnings because otherwise there are always three annoying warnings in development
// It's unfortunately not possible to selectively disable warnings
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'false';

unhandled({
  reportButton: error => {
    openNewGitHubIssue({
      user: 'jmerle',
      repo: 'deskdocs',
      body: `\`\`\`\n${error.stack}\n\`\`\`\n\n---\n\n${debugInfo()}`,
    });
  },
});

app.setAppUserModelId('com.jaspervanmerle.deskdocs');

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.on('second-instance', () => {
  const types = [WindowType.Main, WindowType.Preferences];

  for (const type of types) {
    if (windows.has(type)) {
      restoreWindow(windows.get(type));
    }
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  if (!windows.has(WindowType.Main)) {
    await createWindow(WindowType.Main);
  }
});

(async () => {
  await app.whenReady();
  Menu.setApplicationMenu(menu);
  await createWindow(WindowType.Main);
})();
