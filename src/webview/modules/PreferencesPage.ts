import { config } from '../../common/config';
import { Module } from './Module';

enum PreferenceType {
  Checkbox,
  Accelerator,
}

interface Preference {
  id: string;
  type: PreferenceType;
  label: string;
  description?: string;
}

export class PreferencesPage extends Module {
  private readonly preferences: Preference[] = [
    {
      id: 'launchOnBoot',
      type: PreferenceType.Checkbox,
      label: 'Launch on boot',
    },
    {
      id: 'startMinimized',
      type: PreferenceType.Checkbox,
      label: 'Launch minimized',
      description: 'With this checked, DeskDocs will minimize itself to the tray when it is started.',
    },
    {
      id: 'globalShortcutEnabled',
      type: PreferenceType.Checkbox,
      label: 'Enable global shortcut',
      description:
        'With this checked, pressing the global shortcut configured below will toggle focus on the DeskDocs window.',
    },
    {
      id: 'globalShortcut',
      type: PreferenceType.Accelerator,
      label: 'Global shortcut',
    },
    {
      id: 'showSingleTab',
      type: PreferenceType.Checkbox,
      label: 'Enable auto restore',
      description:
        'With this checked, tabs that were open when DeskDocs was last closed will be re-opened when DeskDocs is started again.',
    },
  ];

  private syncedIds: Map<string, boolean> = new Map();

  protected shouldActivate(pathname: string): boolean {
    return pathname === '/settings';
  }

  protected onNavigate(pathname: string): void {
    this.addSettingsSection();
    this.addPreferences();
    this.syncPreferences();
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

  private addPreferences(): void {
    for (const { id, type, label, description } of this.preferences) {
      const currentValue = config.get(id);

      switch (type) {
        case PreferenceType.Checkbox:
          this.addCheckbox(id, currentValue, label, description);
          break;
        case PreferenceType.Accelerator:
          this.addAccelerator(id, currentValue, label, description);
          break;
      }
    }
  }

  private syncPreferences(): void {
    document.querySelectorAll('._settings-label > input').forEach(checkbox => {
      const id = checkbox.getAttribute('name');

      let type: PreferenceType = null;
      switch (checkbox.getAttribute('type')) {
        case 'checkbox':
          type = PreferenceType.Checkbox;
          break;
        case 'string':
          type = PreferenceType.Accelerator;
          break;
      }

      if (type !== null) {
        this.syncPreference(id, type);
      }
    });
  }

  private syncPreference(id: string, type: PreferenceType): void {
    if (this.syncedIds.has(id)) {
      return;
    }

    this.syncedIds.set(id, true);

    this.onConfigChange(id, newValue => {
      switch (type) {
        case PreferenceType.Checkbox:
          this.updateCheckbox(id, newValue);
          break;
        case PreferenceType.Accelerator:
          this.updateAccelerator(id, newValue);
          break;
      }
    });
  }

  private addCheckbox(id: string, enabled: boolean, label: string, description?: string): void {
    const labelHtml = `
      <label class="_settings-label">
        <input type="checkbox" name="${id}" ${enabled ? 'checked="checked"' : ''}>
        ${label}
        ${description === undefined ? '' : `<small>${description}</small>`}
      </label>
    `;

    this.addInput(labelHtml);
  }

  private addAccelerator(id: string, currentValue: string, label: string, description?: string): void {
    const labelHtml = `
      <label class="_settings-label">
        <input type="text" name="${id}" value="${currentValue}">
        ${label}
        ${description === undefined ? '' : `<small>${description}</small>`}
      </label>
    `;

    this.addInput(labelHtml);
  }

  private updateCheckbox(id: string, newValue: boolean): void {
    //
  }

  private updateAccelerator(id: string, newValue: string): void {
    //
  }

  private addInput(html: string): void {
    document.querySelector('#deskdocs-inputs').insertAdjacentHTML('beforeend', html);
  }
}
