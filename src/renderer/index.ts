import { initUnhandled } from '../common/unhandled';
import { WindowType } from '../common/WindowType';
import { setTitle } from './common/dom';
import { answerMain } from './common/ipc';
import { initMain } from './main';
import { initPreferences } from './preferences';

import '../styles/index.scss';

initUnhandled();

answerMain('type', (type: WindowType) => {
  const container: HTMLElement = document.querySelector('#app');

  setTitle(type.toString());

  const bodyClasses = document.body.classList;
  bodyClasses.add('theme-default');
  bodyClasses.add(`window-${type === WindowType.Main ? 'main' : 'preferences'}`);

  if (type === WindowType.Main) {
    initMain(container);
  } else {
    initPreferences(container);
  }
});
