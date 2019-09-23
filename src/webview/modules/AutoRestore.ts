import { ipcRenderer } from 'electron';
import { Module } from './Module';

export class AutoRestore extends Module {
  protected onNavigate(pathname: string): void {
    ipcRenderer.sendToHost('pathname', { pathname });
  }
}
