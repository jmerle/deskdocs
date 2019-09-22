import { WebContents } from 'electron';
import { triggerOverride } from './trigger-override';

// tslint:disable-next-line:no-var-requires
const { FindInPage } = require('electron-find');

export class ImprovedFindInPage extends FindInPage {
  private triggersToDisable = ['typing', 'enter', 'escape'];

  constructor(webContents: WebContents, options?: any) {
    super(webContents, options);
  }

  public openFindWindow(): boolean {
    triggerOverride.disableDefaultBehavior(this.triggersToDisable);
    return super.openFindWindow();
  }

  public closeFindWindow(): boolean {
    triggerOverride.enableDefaultBehavior(this.triggersToDisable);
    return super.closeFindWindow();
  }
}
