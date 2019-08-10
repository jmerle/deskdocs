import { app, Menu } from 'electron';
import { initUnhandled } from '../common/unhandled';
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

// Has to be identical to the appId in the build configuration in package.json
app.setAppUserModelId('com.jaspervanmerle.deskdocs');

initUnhandled();

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
