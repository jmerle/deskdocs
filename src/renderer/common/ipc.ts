import { ipcRenderer, RendererProcessIpc } from 'electron-better-ipc';

export const callMain = ipcRenderer.callMain;

export function answerMain(
  channel: string,
  callback: (data?: any) => ReturnType<Parameters<RendererProcessIpc['answerMain']>[1]> | void,
): ReturnType<RendererProcessIpc['answerMain']> {
  return ipcRenderer.answerMain(channel, data => {
    const value = callback(data);
    return typeof value !== 'undefined' ? value : null;
  });
}
