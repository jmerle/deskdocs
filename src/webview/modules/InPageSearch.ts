import { remote } from 'electron';
import { ImprovedFindInPage } from '../utils/ImprovedFindInPage';
import { Module } from './Module';

export class InPageSearch extends Module {
  protected getCssToInject(): string {
    return `
      .find-box {
        background: var(--headerBackground) !important;
        box-shadow: none !important;
        border: 1px solid var(--searchBorder) !important;
        border-radius: 3px !important;
      }
      
      .find-input {      
        padding: 5px !important;
      
        color: var(--textColor) !important;
        background: var(--contentBackground) !important;
        
        border: 1px solid var(--searchBorder) !important;
        border-radius: 3px !important;
      }
      
      .find-matches { 
        color: var(--textColor) !important;
      }
      
      .find-case {
        color: var(--textColor) !important;
        background: var(--contentBackground) !important;
      }
      
      .find-back, .find-forward, .find-close {
        background: var(--contentBackground) !important;
        margin-top: 2.5px !important;
        margin-bottom: 2.5px !important;
      }
      
      .find-close {
        margin-left: 4px !important;
      }
      
      .find-back-line, .find-back-cover {
        border-right-color: var(--textColor) !important;
      }
      
      .find-forward-line, .find-forward-cover {
        border-left-color: var(--textColor) !important;
      }
      
      .find-close-inner1, .find-close-inner2 {
        background: var(--textColor) !important;
      }
    `;
  }

  protected onFirstNavigate(pathname: string): void {
    const findInPage = new ImprovedFindInPage(remote.getCurrentWebContents(), {
      preload: true,
      offsetTop: 18,
      offsetRight: 18,
      caseSelectedColor: 'var(--absolute)',
    });

    this.onRenderer('openInPageSearch', () => {
      findInPage.openFindWindow();
    });
  }
}
