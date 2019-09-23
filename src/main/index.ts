import { app, Menu } from 'electron';
import { is } from 'electron-util';
import { initUnhandled } from '../common/unhandled';
import { mainConfig } from './config';
import { configureContentSecurityPolicy } from './configure/content-security-policy';
import { configureGlobalShortcut } from './configure/global-shortcut';
import { configureLaunchOnBoot } from './configure/launch-on-boot';
import { configureSystemTheme } from './configure/system-theme';
import { configureTray } from './configure/tray';
import { menu } from './menu';
import { startQuitting } from './quit';
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

if (is.linux) {
  app.disableHardwareAcceleration();
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

mainConfig.init();

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

app.on('before-quit', () => {
  startQuitting();
});

(async () => {
  await app.whenReady();

  Menu.setApplicationMenu(menu);

  configureTray();
  configureContentSecurityPolicy();
  configureGlobalShortcut();
  configureLaunchOnBoot();
  configureSystemTheme();

  if (!mainConfig.get('launchToTray')) {
    await createOrRestoreWindow();
  }
})();
