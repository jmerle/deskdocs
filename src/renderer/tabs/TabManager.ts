import { remote, WebviewTag } from 'electron';
import { is } from 'electron-util';
import * as path from 'path';
import { BASE_URL } from '../../common/constants';
import { rendererConfig } from '../config';
import { ImprovedChromeTabs } from './ImprovedChromeTabs';
import { Tab } from './Tab';

export class TabManager {
  private tabs: Tab[] = [];

  private chromeTabs = new ImprovedChromeTabs();

  constructor(private tabsContainer: HTMLElement, private webviewsContainer: HTMLElement) {}

  public init(): void {
    this.chromeTabs.init(this.tabsContainer);
    this.updateTheme();

    this.tabsContainer.addEventListener('activeTabChange', (event: any) => {
      const tabEl: HTMLElement = event.detail.tabEl;
      const tab = this.tabs.find(t => t.id === tabEl.id);

      if (tab !== undefined) {
        this.showTab(tab);
        this.updateAutoRestoreConfig();
      }
    });

    this.tabsContainer.addEventListener('tabReorder', () => {
      this.sortTabsArray();
      this.updateAutoRestoreConfig();
    });

    rendererConfig.onChange('dark', () => {
      this.updateTheme();
    });
  }

  public getTabById(id: string): Tab {
    return this.tabs.find(t => t.id === id);
  }

  public getTabCount(): number {
    return this.tabs.length;
  }

  public getCurrentTab(): Tab {
    const tabEl = this.chromeTabs.activeTabEl;

    if (tabEl === null) {
      return null;
    }

    return this.getTabById(tabEl.id);
  }

  public addTab(pathname: string = '/'): void {
    const tabEl = this.createTab();
    const webview = this.createWebview(pathname);

    const id = this.generateId();
    tabEl.id = id;

    const tab = new Tab(id, this.tabs.length, tabEl, webview, pathname);
    this.tabs.push(tab);

    tab.once('close', () => {
      this.closeTab(tab);
    });

    tab.on('pathname', () => {
      this.updateAutoRestoreConfig();
    });

    this.showTab(tab);
    this.updateTabContainerVisibility();
    this.updateAutoRestoreConfig();
  }

  public closeTab(tab: Tab): void {
    this.chromeTabs.removeTab(tab.tabEl);
    tab.webview.remove();

    this.tabs.splice(this.tabs.indexOf(tab), 1);

    this.updateTabIndexes();
    this.updateTabContainerVisibility();
    this.updateAutoRestoreConfig();

    if (this.tabs.length === 0) {
      remote.app.quit();
    }
  }

  public closeOtherTabs(tab: Tab): void {
    const tabsToClose = this.tabs.filter(t => t.id !== tab.id);
    tabsToClose.forEach(t => this.closeTab(t));
  }

  public closeTabsToRight(tab: Tab): void {
    const tabsToClose = this.tabs.filter(t => t.index > tab.index);
    tabsToClose.forEach(t => this.closeTab(t));
  }

  public showTabAtIndex(index: number): void {
    if (index >= this.tabs.length) {
      return;
    }

    this.showTab(this.tabs[index]);
  }

  public updateTabContainerVisibility(): void {
    const hidden = !rendererConfig.get('showSingleTab') && this.tabs.length <= 1;
    this.tabsContainer.classList.toggle('hidden', hidden);
  }

  private showTab(tab: Tab): void {
    if (this.chromeTabs.activeTabEl.id !== tab.id) {
      this.chromeTabs.setCurrentTab(tab.tabEl);
    }

    this.tabs.forEach(t => t.setVisibility(t.id === tab.id));
  }

  private sortTabsArray(): void {
    const currentIds = this.chromeTabs.tabEls.map(t => t.id);
    this.tabs.sort((a, b) => currentIds.indexOf(a.id) - currentIds.indexOf(b.id));
  }

  private updateTabIndexes(): void {
    this.tabs.forEach((t, i) => {
      t.index = i;
    });
  }

  private createTab(): HTMLElement {
    this.chromeTabs.addTab({
      title: 'DevDocs',
    });

    const tabEls = this.chromeTabs.tabEls;
    return tabEls[tabEls.length - 1];
  }

  private createWebview(pathname: string): WebviewTag {
    const webview = document.createElement('webview');
    webview.setAttribute('src', BASE_URL + pathname);
    webview.setAttribute('webpreferences', 'experimentalFeatures');

    const preloadPath = is.development ? '../../../dist/renderer/webview.js' : 'webview.js';
    webview.setAttribute('preload', `file://${path.resolve(__dirname, preloadPath)}`);

    this.webviewsContainer.appendChild(webview);

    return webview;
  }

  private updateTheme(): void {
    this.tabsContainer.classList.toggle('chrome-tabs-dark-theme', rendererConfig.get('dark'));
  }

  private updateAutoRestoreConfig(): void {
    const currentTab = this.getCurrentTab();
    rendererConfig.set('autoRestorePathnames', this.tabs.map(tab => tab.pathname));
    rendererConfig.set('autoRestoreCurrentTab', currentTab === null ? -1 : currentTab.index);
  }

  private generateId(): string {
    return Math.random()
      .toString(36)
      .substr(2, 9);
  }
}
