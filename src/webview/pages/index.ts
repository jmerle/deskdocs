import { GenericPageHandler } from './GenericPageHandler';
import { GuidePageHandler } from './GuidePageHandler';
import { HomePageHandler } from './HomePageHandler';
import { PageHandler } from './PageHandler';
import { PreferencesPageHandler } from './PreferencesPageHandler';

export const pageHandlers = new Map<string, new () => PageHandler>([
  ['*', GenericPageHandler],
  ['/', HomePageHandler],
  ['/settings', PreferencesPageHandler],
  ['/help', GuidePageHandler],
]);
