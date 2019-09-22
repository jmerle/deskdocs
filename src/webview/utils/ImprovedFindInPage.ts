import { WebContents } from 'electron';

// tslint:disable-next-line:no-var-requires
const { FindInPage } = require('electron-find');

export class ImprovedFindInPage extends FindInPage {
  private overrideTrigger = false;

  constructor(webContents: WebContents, options?: any) {
    super(webContents, options);

    this.patchTrigger();
  }

  public openFindWindow(): boolean {
    this.overrideTrigger = true;
    return super.openFindWindow();
  }

  public closeFindWindow(): boolean {
    this.overrideTrigger = false;
    return super.closeFindWindow();
  }

  private patchTrigger(): void {
    // tslint:disable-next-line:no-this-assignment
    const self = this;
    const overrideTriggerNames = ['typing', 'enter', 'escape'];

    const originalTrigger = app.shortcuts.trigger;
    app.shortcuts.trigger = function(): any {
      if (self.overrideTrigger && overrideTriggerNames.includes(arguments[0])) {
        return;
      }

      return originalTrigger.apply(this, arguments);
    };
  }
}
