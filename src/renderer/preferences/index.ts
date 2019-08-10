import { remote } from 'electron';
import * as contextMenu from 'electron-context-menu';
import { is } from 'electron-util';

export function initPreferences(container: HTMLElement): void {
  container.innerHTML = `
    <h1>Preferences</h1>
  `;

  contextMenu({
    window: remote.getCurrentWindow(),
    showInspectElement: is.development,
  });
}
