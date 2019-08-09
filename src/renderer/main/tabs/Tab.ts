import { WebviewTag } from 'electron';
import * as EventEmitter from 'eventemitter3';

interface TabEvents {
  close: [];
  'close-others': [];
}

export class Tab extends EventEmitter<TabEvents> {
  constructor(public id: string, public tabEl: HTMLElement, public webview: WebviewTag) {
    super();
  }

  public setVisibility(visible: boolean): void {
    const classes = this.webview.classList;
    classes.toggle('hidden', !visible);
  }
}
