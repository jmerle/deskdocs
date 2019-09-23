import { answerMain } from '../common/ipc';
import { initUnhandled } from '../common/unhandled';
import { rendererConfig } from './config';
import { initWindowContextMenu } from './context-menu';
import { TabManager } from './tabs/TabManager';
import { initTheme } from './theme';

import './styles/index.scss';

initUnhandled();
rendererConfig.init();
initTheme();

const container: HTMLElement = document.querySelector('#app');

container.innerHTML = `
  <div id="tabs" class="chrome-tabs hidden">
    <div class="chrome-tabs-content"></div>
  </div>
  <div id="webviews"></div>
`;

const tabsContainer: HTMLElement = container.querySelector('#tabs');
const webviewsContainer: HTMLElement = container.querySelector('#webviews');

const manager = new TabManager(tabsContainer, webviewsContainer);

manager.init();
initWindowContextMenu(manager);

manager.addTab();

answerMain('addTab', () => {
  manager.addTab();
});

answerMain('closeCurrentTab', () => {
  manager.closeTab(manager.getCurrentTab());
});

answerMain('showTab', ({ index }) => {
  console.log('showTab', index);
  manager.showTabAtIndex(index);
});

rendererConfig.onChange('showSingleTab', () => {
  manager.updateTabContainerVisibility();
});

answerMain('openInPageSearch', () => {
  manager.getCurrentTab().send('openInPageSearch');
});
