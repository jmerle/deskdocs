import ChromeTabs from 'chrome-tabs';
import { WebviewTag } from 'electron';
import { api } from 'electron-util';
import { Tab } from './Tab';

export class TabManager {
  private tabs: Tab[] = [];

  private chromeTabs = new ChromeTabs();

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

    this.tabsContainer.addEventListener('tabRemove', (event: any) => {
      const tabEl: HTMLElement = event.detail.tabEl;
      const tab = this.tabs.find(t => t.id === tabEl.id);
      this.closeTab(tab);
    });

    this.tabsContainer.addEventListener('tabReorder', () => {
      this.orderTabs();
    });
  }

  public addTab(): void {
    const tabEl = this.createTab();
    const webview = this.createWebview();

    const id = this.generateId();
    tabEl.id = id;

    const tab = new Tab(id, tabEl, webview);
    this.tabs.push(tab);

    tab.once('close', () => {
      this.closeTab(tab);
    });

    this.showTab(tab);
  }

  private closeTab(tab: Tab): void {
    if (document.getElementById(tab.id) !== null) {
      this.chromeTabs.removeTab(tab.tabEl);
    }

    tab.webview.remove();

    this.tabs.splice(this.tabs.indexOf(tab), 1);
    this.tabsContainer.classList.toggle('hidden', this.tabs.length <= 1);

    if (this.tabs.length === 0) {
      api.app.quit();
    }
  }

  private showTab(tab: Tab): void {
    if (this.chromeTabs.activeTabEl.id !== tab.id) {
      this.chromeTabs.setCurrentTab(tab.tabEl);
    }

    this.tabs.forEach(t => t.setVisibility(t === tab));
  }

  private orderTabs(): void {
    const currentIds = this.chromeTabs.tabEls.map(t => t.id);
    this.tabs.sort((a, b) => currentIds.indexOf(a.id) - currentIds.indexOf(b.id));
  }

  private createTab(): HTMLElement {
    this.chromeTabs.addTab({
      title: 'DevDocs',
    });

    const tabEls = this.chromeTabs.tabEls;
    return tabEls[tabEls.length - 1];
  }

  private createWebview(): WebviewTag {
    const webview = document.createElement('webview');
    webview.setAttribute('src', 'https://devdocs.io/');

    this.webviewsContainer.appendChild(webview);

    return webview;
  }

  private generateId(): string {
    return Math.random()
      .toString(36)
      .substr(2, 9);
  }
}
