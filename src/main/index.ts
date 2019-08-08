import { app, BrowserWindow, Menu } from 'electron';
import installExtension, { REDUX_DEVTOOLS } from 'electron-devtools-installer';
import * as unhandled from 'electron-unhandled';
import { debugInfo, is, openNewGitHubIssue } from 'electron-util';
import * as path from 'path';
import * as url from 'url';
import { menu } from './menu';

declare global {
  // https://webpack.electron.build/using-static-assets
  // tslint:disable-next-line:variable-name
  const __static: string;
}

// Disabling security warnings because otherwise there are always three annoying warnings in development
// It's unfortunately not possible to selectively disable warnings
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'false';

let mainWindow: BrowserWindow | null = null;

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

async function createMainWindow(): Promise<BrowserWindow> {
  const window = new BrowserWindow({
    icon: path.join(__static, 'icon.png'),
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  window.on('closed', () => {
    mainWindow = null;
  });

  window.maximize();

  if (is.development) {
    window.webContents.openDevTools({
      mode: 'bottom',
    });
  }

  if (is.development) {
    await window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    await window.loadURL(
      url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      }),
    );
  }

  return window;
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.on('second-instance', () => {
  if (mainWindow !== null) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }

    mainWindow.show();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  if (mainWindow === null) {
    mainWindow = await createMainWindow();
  }
});

(async () => {
  await app.whenReady();
  Menu.setApplicationMenu(menu);
  mainWindow = await createMainWindow();

  if (is.development) {
    try {
      await installExtension(REDUX_DEVTOOLS);
    } catch (err) {
      // Silently fail
    }
  }
})();
