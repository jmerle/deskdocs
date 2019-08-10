import { WebviewTag } from 'electron';
import { api } from 'electron-util';
import { DEFAULT_URL } from '../../../common/constants';
import { ImprovedChromeTabs } from './ImprovedChromeTabs';
import { Tab } from './Tab';

export class TabManager {
  private tabs: Tab[] = [];

  private chromeTabs = new ImprovedChromeTabs();

  constructor(private tabsContainer: HTMLElement, private webviewsContainer: HTMLElement) {}

  public init(): void {
    this.chromeTabs.init(this.tabsContainer);

    this.tabsContainer.addEventListener('activeTabChange', (event: any) => {
      const tabEl: HTMLElement = event.detail.tabEl;
      const tab = this.tabs.find(t => t.id === tabEl.id);

      if (tab !== undefined) {
        this.showTab(tab);
      }
    });

    this.tabsContainer.addEventListener('tabReorder', () => {
      this.orderTabs();
    });
  }

  public getTabById(id: string): Tab {
    return this.tabs.find(t => t.id === id);
  }

  public getTabCount(): number {
    return this.tabs.length;
  }

  public addTab(url: string = DEFAULT_URL): void {
    const tabEl = this.createTab();
    const webview = this.createWebview(url);

    const id = this.generateId();
    tabEl.id = id;

    const tab = new Tab(id, this.tabs.length, tabEl, webview);
    this.tabs.push(tab);

    tab.once('close', () => {
      this.closeTab(tab);
    });

    this.showTab(tab);
    this.updateTabContainerVisibility();
  }

  public closeTab(tab: Tab): void {
    this.chromeTabs.removeTab(tab.tabEl);
    tab.webview.remove();

    this.tabs.splice(this.tabs.indexOf(tab), 1);
    this.updateTabIndexes();
    this.updateTabContainerVisibility();

    if (this.tabs.length === 0) {
      api.app.quit();
    }
  }

  public closeCurrentTab(): void {
    const tabEl = this.chromeTabs.activeTabEl;

    if (tabEl === null) {
      return;
    }

    this.closeTab(this.getTabById(tabEl.id));
  }

  public closeOtherTabs(tab: Tab): void {
    const tabsToClose = this.tabs.filter(t => t.id !== tab.id);
    tabsToClose.forEach(t => this.closeTab(t));
  }

  public closeTabsToRight(tab: Tab): void {
    const tabsToClose = this.tabs.filter(t => t.index > tab.index);
    tabsToClose.forEach(t => this.closeTab(t));
  }

  private showTab(tab: Tab): void {
    if (this.chromeTabs.activeTabEl.id !== tab.id) {
      this.chromeTabs.setCurrentTab(tab.tabEl);
    }

    this.tabs.forEach(t => t.setVisibility(t.id === tab.id));
  }

  private orderTabs(): void {
    const currentIds = this.chromeTabs.tabEls.map(t => t.id);
    this.tabs.sort((a, b) => currentIds.indexOf(a.id) - currentIds.indexOf(b.id));
  }

  private updateTabIndexes(): void {
    this.tabs.forEach((t, i) => {
      t.index = i;
    });
  }

  private updateTabContainerVisibility(): void {
    this.tabsContainer.classList.toggle('hidden', this.tabs.length <= 1);
  }

  private createTab(): HTMLElement {
    this.chromeTabs.addTab({
      title: 'DevDocs',
    });

    const tabEls = this.chromeTabs.tabEls;
    return tabEls[tabEls.length - 1];
  }

  private createWebview(url: string): WebviewTag {
    const webview = document.createElement('webview');
    webview.setAttribute('src', url);

    this.webviewsContainer.appendChild(webview);

    return webview;
  }

  private generateId(): string {
    return Math.random()
      .toString(36)
      .substr(2, 9);
  }
}
