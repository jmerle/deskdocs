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

export const preferences: Preference[] = [
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
