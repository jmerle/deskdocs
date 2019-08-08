import { WindowType } from '../common/WindowType';
import { setTitle } from './common/dom';
import { answerMain } from './common/ipc';
import { initMain } from './main';
import { initPreferences } from './preferences';

const container: HTMLDivElement = document.querySelector('#app');

answerMain('type', (type: WindowType) => {
  setTitle(type.toString());

  if (type === WindowType.Main) {
    initMain(container);
  } else {
    initPreferences(container);
  }
});
