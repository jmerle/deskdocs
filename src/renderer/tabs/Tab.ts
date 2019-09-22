import { WebviewTag } from 'electron';
import * as EventEmitter from 'eventemitter3';
import { callMain } from '../../common/ipc';
import { initWebviewContextMenu } from '../context-menu';

interface TabEvents {
  close: [];
}

export class Tab extends EventEmitter<TabEvents> {
  constructor(public id: string, public index: number, public tabEl: HTMLElement, public webview: WebviewTag) {
    super();

    this.initEvents();
  }

  private initEvents(): void {
    this.tabEl.addEventListener('mouseup', event => {
      if (event.button === 1) {
        this.emit('close');
      }
    });

    this.tabEl.querySelector('.chrome-tab-close').addEventListener('click', event => {
      this.emit('close');
    });

    let needsContextMenu = true;
    this.webview.addEventListener('dom-ready', () => {
      if (needsContextMenu) {
        initWebviewContextMenu(this.webview);
        needsContextMenu = false;
      }
    });

    this.webview.addEventListener('ipc-message', data => {
      if (!this.webview.classList.contains('hidden')) {
        callMain(data.channel, ...data.args);
      }
    });
  }

  public setVisibility(visible: boolean): void {
    const classes = this.webview.classList;
    classes.toggle('hidden', !visible);
  }

  public send(channel: string, data?: any): void {
    this.webview.send(channel, data);
  }
}
