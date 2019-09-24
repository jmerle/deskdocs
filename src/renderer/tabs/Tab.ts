import { shell, WebviewTag } from 'electron';
import * as EventEmitter from 'eventemitter3';
import { BASE_URL } from '../../common/constants';
import { callMain } from '../../common/ipc';
import { initWebviewContextMenu } from '../context-menu';

interface TabEvents {
  close: [];
  pathnameUpdated: [];
  newTab: [string];
  titleUpdated: [];
  faviconUpdated: [];
}

export class Tab extends EventEmitter<TabEvents> {
  public title = 'Index';
  public favicon = '';

  constructor(
    public id: string,
    public index: number,
    public tabEl: HTMLElement,
    public webview: WebviewTag,
    public pathname: string,
  ) {
    super();

    this.initTabElement();
    this.initWebview();
  }

  public setVisibility(visible: boolean): void {
    const classes = this.webview.classList;
    classes.toggle('hidden', !visible);
  }

  public send(channel: string, data?: any): void {
    this.webview.send(channel, data);
  }

  private initTabElement(): void {
    this.tabEl.addEventListener('mouseup', event => {
      if (event.button === 1) {
        this.emit('close');
      }
    });

    this.tabEl.querySelector('.chrome-tab-close').addEventListener('click', event => {
      this.emit('close');
    });
  }

  private initWebview(): void {
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
        this.emit('pathnameUpdated');
      }

      if (!this.webview.classList.contains('hidden')) {
        callMain(data.channel, ...data.args);
      }
    });

    this.webview.addEventListener('page-title-updated', event => {
      this.title = event.title.replace(' — DevDocs', '');

      if (this.title === 'DevDocs API Documentation') {
        this.title = 'Index';
      }

      this.emit('titleUpdated');
    });

    this.webview.addEventListener('page-favicon-updated', event => {
      this.favicon = event.favicons[0];
      this.emit('faviconUpdated');
    });
  }
}
