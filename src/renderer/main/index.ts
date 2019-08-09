import { TabManager } from './tabs/TabManager';

export function initMain(container: HTMLElement): void {
  container.innerHTML = `
    <div id="tabs" class="chrome-tabs">
      <div class="chrome-tabs-content"></div>
    </div>
    <div id="webviews"></div>
  `;

  const tabsContainer: HTMLElement = container.querySelector('#tabs');
  const webviewsContainer: HTMLElement = container.querySelector('#webviews');

  const manager = new TabManager(tabsContainer, webviewsContainer);

  manager.init();
  manager.addTab();
  manager.addTab();
  manager.addTab();
}
