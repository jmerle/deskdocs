import { config } from '../../common/config';
import { PageHandler } from './PageHandler';

export class PreferencesPageHandler extends PageHandler {
  public onNavigate(pathname: string): void {
    this.addSettingsSection();

    this.addCheckbox('launchOnBoot', config.get('launchOnBoot'), 'Launch on boot');

    this.addCheckbox(
      'startMinimized',
      config.get('startMinimized'),
      'Launch minimized',
      'With this checked, DeskDocs will minimize itself to the tray when it is started.',
    );

    this.addCheckbox(
      'globalShortcutEnabled',
      config.get('globalShortcutEnabled'),
      'Enable global shortcut',
      'With this checked, pressing the global shortcut configured below will toggle focus on the DeskDocs window.',
    );

    this.addCheckbox(
      'showSingleTab',
      config.get('showSingleTab'),
      'Show tab bar with single open tab',
      'With this checked, the tab bar will also show if there is only one tab open.',
    );

    this.addCheckbox(
      'autoRestore',
      config.get('autoRestore'),
      'Enable auto restore',
      'With this checked, tabs that were open when DeskDocs was last closed will be re-opened when DeskDocs is started again.',
    );
  }

  private addSettingsSection(): void {
    const fieldsetHtml = `
      <div class="_settings-fieldset">
        <h2 class="_settings-legend">DeskDocs:</h2>
        <div class="_settings-inputs" id="deskdocs-inputs"></div>
      </div>
    `;

    const lastFieldset = document.querySelector('._static > ._settings-fieldset:last-of-type');
    lastFieldset.insertAdjacentHTML('afterend', fieldsetHtml);
  }

  private addCheckbox(id: string, enabled: boolean, label: string, description?: string): void {
    const labelHtml = `
      <label class="_settings-label">
        <input type="checkbox" name="${id}"${enabled ? ' checked="checked"' : ''}>
        ${label}
        ${description === undefined ? '' : `<small>${description}</small>`}
      </label>
    `;

    document.querySelector('#deskdocs-inputs').insertAdjacentHTML('beforeend', labelHtml);
  }
}
