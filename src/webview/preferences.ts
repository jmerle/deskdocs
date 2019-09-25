import { is } from 'electron-util';

export enum PreferenceType {
  Checkbox,
  Accelerator,
}

export interface Preference {
  id: string;
  type: PreferenceType;
  label: string;
  description?: string;
}

export function buildPreferences(): Preference[] {
  const preferences: Preference[] = [
    {
      id: 'launchToTray',
      type: PreferenceType.Checkbox,
      label: 'Launch to tray',
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
      label: 'Show single tab',
      description: 'With this checked, the tab bar will also be visible when there is only one visible tab.',
    },
    {
      id: 'autoRestore',
      type: PreferenceType.Checkbox,
      label: 'Enable auto restore',
      description:
        'With this checked, tabs that were open when DeskDocs was last closed will be re-opened when DeskDocs is started again.',
    },
  ];

  if (!is.development) {
    preferences.unshift({
      id: 'launchOnBoot',
      type: PreferenceType.Checkbox,
      label: 'Launch on boot',
    });
  }

  if (is.macos || is.windows) {
    preferences.push({
      id: 'useSystemTheme',
      type: PreferenceType.Checkbox,
      label: 'Use system theme',
      description:
        'With this checked, the "Enable dark theme" option will stop working and the system theme will be used instead.',
    });
  }

  if (!is.macos) {
    preferences.push({
      id: 'hideMenuBar',
      type: PreferenceType.Checkbox,
      label: 'Hide menu bar',
      description:
        'With this checked, the menu bar will automatically hide and will show up again by pressing the <code class="_label">alt</code> key.',
    });
  }

  return preferences;
}
