import { shell, WebviewTag } from 'electron';
import * as EventEmitter from 'eventemitter3';
import { BASE_URL } from '../../common/constants';
import { callMain } from '../../common/ipc';
import { initWebviewContextMenu } from '../context-menu';

interface TabEvents {
  close: [];
  pathname: [string];
  newTab: [string];
}

export class Tab extends EventEmitter<TabEvents> {
  constructor(
    public id: string,
    public index: number,
    public tabEl: HTMLElement,
    public webview: WebviewTag,
    public pathname: string,
  ) {
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

      this.webview.getWebContents().on('new-window', (event, url, frameName, disposition) => {
        if (url !== 'about:blank') {
          if (disposition === 'background-tab' && url.startsWith(BASE_URL)) {
            this.emit('newTab', url.replace(BASE_URL, ''));
          } else {
            shell.openExternal(url);
          }
        }
      });
    });

    this.webview.addEventListener('ipc-message', data => {
      if (data.channel === 'pathname') {
        this.pathname = data.args[0].pathname;
        this.emit('pathname', this.pathname);
      }

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
