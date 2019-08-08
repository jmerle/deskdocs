import { h, View } from 'hyperapp';
import { Actions } from './actions';
import { State } from './state';

export const view: View<State, Actions> = (state, actions) => <div>{state.updates.status}</div>;
