import { BrowserView } from 'electron';
import { ipcMain, MainProcessIpc } from 'electron-better-ipc';

export const callRenderer = ipcMain.callRenderer;

export function answerRenderer(
  channel: string,
  callback: (
    data: any,
    browserWindow: BrowserView,
  ) => ReturnType<Parameters<MainProcessIpc['answerRenderer']>[1]> | void,
): ReturnType<MainProcessIpc['answerRenderer']> {
  return ipcMain.answerRenderer(channel, (data, browserWindow) => {
    const value = callback(data, browserWindow);
    return value !== undefined ? value : null;
  });
}
