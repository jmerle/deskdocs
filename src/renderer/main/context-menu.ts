import { MenuItemConstructorOptions, remote, WebviewTag } from 'electron';
import * as contextMenu from 'electron-context-menu';
import { is } from 'electron-util';
import { TabManager } from './tabs/TabManager';

function getTabId(elem: Element): string {
  if (elem.classList.contains('chrome-tab')) {
    return elem.id;
  }

  if (elem.parentElement === null) {
    return null;
  }

  return getTabId(elem.parentElement);
}

export function initWindowContextMenu(tabManager: TabManager): void {
  contextMenu({
    window: remote.getCurrentWindow(),
    showInspectElement: is.development,
    prepend: (defaultActions, params, browserWindow) => {
      const elem = document.elementFromPoint(params.x, params.y);
      const tabId = getTabId(elem);

      if (tabId === null) {
        return [];
      }

      const tab = tabManager.getTabById(tabId);
      const tabCount = tabManager.getTabCount();

      // noinspection JSMismatchedCollectionQueryUpdate
      const items: MenuItemConstructorOptions[] = [
        {
          label: 'New tab',
          accelerator: 'CommandOrControl+T',
          registerAccelerator: false,
          click: () => {
            tabManager.addTab();
          },
        },
        { type: 'separator' },
        {
          label: 'Close tab',
          accelerator: 'CommandOrControl+W',
          registerAccelerator: false,
          click: () => {
            tabManager.closeTab(tab);
          },
        },
        {
          label: 'Close other tabs',
          enabled: tabCount > 1,
          click: () => {
            tabManager.closeOtherTabs(tab);
          },
        },
        {
          label: 'Close tabs to the right',
          enabled: tab.index < tabCount - 1,
          click: () => {
            tabManager.closeTabsToRight(tab);
          },
        },
      ];

      return items as any[];
    },
  });
}

export function initWebviewContextMenu(webview: WebviewTag): void {
  contextMenu({
    window: webview,
    showInspectElement: is.development,
  });
}
