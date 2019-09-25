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

answerMain('addTab', () => {
  manager.addTab();
});

answerMain('closeCurrentTab', () => {
  manager.closeTab(manager.getCurrentTab());
});

answerMain('showTab', ({ index }) => {
  manager.showTabAtIndex(index);
});

rendererConfig.onChange('showSingleTab', () => {
  manager.updateTabContainerVisibility();
});

answerMain('openInPageSearch', () => {
  manager.getCurrentTab().send('openInPageSearch');
});

answerMain('openPreferences', () => {
  manager.getCurrentTab().send('openPreferences');
});

const autoRestoreEnabled = rendererConfig.get('autoRestore');
const autoRestorePathnames = rendererConfig.get('autoRestorePathnames');
const autoRestoreCurrentTab = rendererConfig.get('autoRestoreCurrentTab');

if (autoRestoreEnabled && autoRestorePathnames.length > 0 && autoRestoreCurrentTab > -1) {
  for (const pathname of autoRestorePathnames) {
    manager.addTab(pathname);
  }

  manager.showTabAtIndex(autoRestoreCurrentTab);
} else {
  manager.addTab();
}
