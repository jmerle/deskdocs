import { AutoRestore } from './AutoRestore';
import { InPageSearch } from './InPageSearch';
import { Module } from './Module';
import { PreferenceActions } from './PreferenceActions';
import { PreferencesMenuItem } from './PreferencesMenuItem';
import { PreferencesPage } from './PreferencesPage';
import { PreferencesSync } from './PreferencesSync';

export const modules: Module[] = [
  new PreferencesSync(),
  new PreferencesPage(),
  new PreferenceActions(),
  new InPageSearch(),
  new AutoRestore(),
  new PreferencesMenuItem(),
];
