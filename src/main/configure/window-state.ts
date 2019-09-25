import { BrowserWindow } from 'electron';
import { mainConfig } from '../config';

let timeout: number = null;

function updateWindowState(mainWindow: BrowserWindow): void {
  const bounds = mainWindow.getBounds();

  mainConfig.set('windowState', {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    maximized: mainWindow.isMaximized(),
  });
}

function scheduleUpdate(mainWindow: BrowserWindow): void {
  if (timeout !== null) {
    clearTimeout(timeout);
    timeout = null;
  }

  setTimeout(() => updateWindowState(mainWindow), 50);
}

export function configureWindowState(mainWindow: BrowserWindow): void {
  mainWindow.on('resize', () => scheduleUpdate(mainWindow));
  mainWindow.on('maximize', () => scheduleUpdate(mainWindow));
  mainWindow.on('move', () => scheduleUpdate(mainWindow));
}
