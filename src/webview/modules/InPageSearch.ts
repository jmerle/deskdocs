import { remote } from 'electron';
import { ImprovedFindInPage } from '../utils/ImprovedFindInPage';
import { Module } from './Module';

export class InPageSearch extends Module {
  protected onFirstNavigate(pathname: string): void {
    const findInPage = new ImprovedFindInPage(remote.getCurrentWebContents(), {
      preload: true,
      offsetTop: 5,
      offsetRight: 18,
    });

    this.onRenderer('openInPageSearch', () => {
      findInPage.openFindWindow();
    });
  }
}
