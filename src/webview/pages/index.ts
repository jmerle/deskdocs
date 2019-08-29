import { GenericPageHandler } from './GenericPageHandler';
import { GuidePageHandler } from './GuidePageHandler';
import { PageHandler } from './PageHandler';
import { PreferencesPageHandler } from './PreferencesPageHandler';

export const pageHandlers = new Map<string, new () => PageHandler>([
  ['*', GenericPageHandler],
  ['/settings', PreferencesPageHandler],
  ['/help', GuidePageHandler],
]);
