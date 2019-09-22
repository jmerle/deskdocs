import { BrowserView, BrowserWindow } from 'electron';
import { ipcMain, ipcRenderer, MainProcessIpc, RendererProcessIpc } from 'electron-better-ipc';

export function callMain(channel: string, data?: any): Promise<unknown> {
  return ipcRenderer.callMain(channel, data).catch(() => {
    // Do nothing
  });
}

export function callRenderer(browserWindow: BrowserWindow, channel: string, data?: any): Promise<unknown> {
  return ipcMain.callRenderer(browserWindow, channel, data).catch(() => {
    // Do nothing
  });
}

export function answerMain(
  channel: string,
  callback: (data?: any) => ReturnType<Parameters<RendererProcessIpc['answerMain']>[1]> | void,
): ReturnType<RendererProcessIpc['answerMain']> {
  return ipcRenderer.answerMain(channel, data => {
    const value = callback(data);
    return typeof value !== 'undefined' ? value : null;
  });
}

export function answerRenderer(
  channel: string,
  callback: (
    data: any,
    browserWindow: BrowserView,
  ) => ReturnType<Parameters<MainProcessIpc['answerRenderer']>[1]> | void,
): ReturnType<MainProcessIpc['answerRenderer']> {
  return ipcMain.answerRenderer(channel, (data, browserWindow) => {
    const value = callback(data, browserWindow);
    return typeof value !== 'undefined' ? value : null;
  });
}
