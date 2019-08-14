import { app, Menu } from 'electron';
import { config } from '../common/config';
import { initUnhandled } from '../common/unhandled';
import { menu } from './menu';
import { createOrRestoreWindow } from './window';

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

config.initMain();

app.on('second-instance', async () => {
  await createOrRestoreWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  await createOrRestoreWindow();
});

(async () => {
  await app.whenReady();
  Menu.setApplicationMenu(menu);
  await createOrRestoreWindow();
})();
