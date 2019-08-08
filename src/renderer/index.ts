import { is } from 'electron-util';
import { app, View } from 'hyperapp';
import devtools from 'hyperapp-redux-devtools';
import { Actions, actions } from './app/actions';
import { getInitialState } from './app/state';
import { view } from './app/view';
import { answerMain } from './utils/ipc';

const initialState = getInitialState();
const container = document.querySelector('#app');

const appParams: Parameters<typeof app> = [initialState, actions, view as View<unknown, unknown>, container];
const main: Actions = is.development ? devtools(app)(...appParams) : app(...appParams);

answerMain('setUpdateStatus', (status: string) => {
  main.updates.updateStatus(status);
});
