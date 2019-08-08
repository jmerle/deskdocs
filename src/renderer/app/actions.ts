import { ActionsType, ActionType } from 'hyperapp';
import { updatesActions } from '../actions/updates';
import { State } from './state';

export type ActionReturnValue<T> = ReturnType<ActionType<any, T, Actions>>;

export interface Actions {
  updates: {
    updateStatus: (status: string) => ActionReturnValue<State['updates']>;
  };
}

export const actions: ActionsType<State, Actions> = {
  updates: updatesActions,
};
