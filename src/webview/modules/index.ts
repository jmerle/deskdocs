import { InPageSearch } from './InPageSearch';
import { Module } from './Module';
import { PreferencesPage } from './PreferencesPage';
import { PreferencesSync } from './PreferencesSync';

export const modules: Module[] = [new PreferencesSync(), new PreferencesPage(), new InPageSearch()];
