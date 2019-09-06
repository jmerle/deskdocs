import { Module } from './Module';
import { PreferencesPage } from './PreferencesPage';
import { PreferencesSync } from './PreferencesSync';

export function createModules(): Module[] {
  return [new PreferencesPage(), new PreferencesSync()];
}
