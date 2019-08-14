import { WebviewTag } from 'electron';
import * as EventEmitter from 'eventemitter3';
import { initWebviewContextMenu } from '../context-menu';

interface TabEvents {
  close: [];
}

export class Tab extends EventEmitter<TabEvents> {
  constructor(public id: string, public index: number, public tabEl: HTMLElement, public webview: WebviewTag) {
    super();

    this.initEvents();

    this.webview.addEventListener('dom-ready', () => {
      initWebviewContextMenu(webview);
    });
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
  }

  public setVisibility(visible: boolean): void {
    const classes = this.webview.classList;
    classes.toggle('hidden', !visible);
  }
}
