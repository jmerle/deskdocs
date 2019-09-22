import { webviewConfig } from '../config';
import { buildPreferences, PreferenceType } from '../preferences';
import { triggerOverride } from '../utils/trigger-override';
import { Module } from './Module';

export class PreferencesPage extends Module {
  private syncedCookies: string[] = [];

  protected getCssToInject(): string {
    return `
      #deskdocs-inputs > ._settings-label > small {
        margin-left: 30px;
      }
    
      .accelerator-label,
      .accelerator-input {
        display: block;
        margin-left: 28px;
      }
      
      .accelerator-input {
        background: var(--contentBackground);
        color: var(--textColor);
        padding: 5px;
        border: 1px solid var(--searchBorder);
        border-radius: 3px;
        height: 1.5rem;
      }
    `;
  }

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
    for (const { id, type, label, description } of buildPreferences()) {
      const currentValue = webviewConfig.get(id);

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
    document.querySelectorAll('._settings-label > input').forEach(input => {
      const id = input.getAttribute('name');

      let type: PreferenceType = null;
      switch (input.getAttribute('type')) {
        case 'checkbox':
          type = PreferenceType.Checkbox;
          break;
        case 'text':
          type = PreferenceType.Accelerator;
          break;
      }

      if (type !== null) {
        this.syncPreference(id, type, id === 'smoothScroll' ? 'fastScroll' : id);
      }
    });
  }

  private syncPreference(id: string, type: PreferenceType, cookie: string = id): void {
    if (this.syncedCookies.includes(cookie)) {
      return;
    }

    this.syncedCookies.push(cookie);

    this.onConfigChange(cookie, newValue => {
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
        <div class="accelerator-label">${label}</div>
        <input type="text" class="accelerator-input" name="${id}" value="${currentValue}">
        <small>Only works if the given shortcut is a valid <a href="https://electronjs.org/docs/api/accelerator">Electron accelerator</a>.</small>
      </label>
    `;

    this.addInput(labelHtml);

    const input = document.querySelector<HTMLInputElement>(`input[name="${id}"]`);
    const triggersToDisable = ['typing', 'enter', 'escape'];

    input.addEventListener('focus', () => {
      triggerOverride.disableDefaultBehavior(triggersToDisable);
    });

    input.addEventListener('blur', () => {
      triggerOverride.enableDefaultBehavior(triggersToDisable);
    });

    const onChange = () => {
      const currentInput = document.querySelector<HTMLInputElement>(`input[name="${id}"]`);
      app.settings.set(id, currentInput.value);
    };

    input.addEventListener('input', () => onChange());
    input.addEventListener('change', event => {
      onChange();
      event.stopPropagation();
    });
  }

  private updateCheckbox(id: string, newValue: boolean | string): void {
    if (id === 'smoothScroll') {
      newValue = !newValue;
    }

    if (id === 'layout') {
      document.querySelectorAll<HTMLInputElement>('input[name="layout"]').forEach(input => {
        input.checked = newValue !== false && (newValue as string).includes(input.getAttribute('value'));
      });
    } else {
      const input = document.querySelector<HTMLInputElement>(`input[name="${id}"]`);
      input.checked = newValue as boolean;
    }
  }

  private updateAccelerator(id: string, newValue: string): void {
    const input = document.querySelector<HTMLInputElement>(`input[name="${id}"]`);
    input.value = newValue;
  }

  private addInput(html: string): void {
    document.querySelector('#deskdocs-inputs').insertAdjacentHTML('beforeend', html);
  }
}
