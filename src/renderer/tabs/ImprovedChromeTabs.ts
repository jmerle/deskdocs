import ChromeTabs from 'chrome-tabs';

export class ImprovedChromeTabs extends ChromeTabs {
  public setTabCloseEventListener(tabEl: HTMLElement): void {
    // Do nothing, the listener is added in the Tab class
  }
}
