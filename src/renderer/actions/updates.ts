import { ActionReturnValue, Actions } from '../app/actions';
import { State } from '../app/state';

function updateStatus(status: string): ActionReturnValue<State['updates']> {
  return {
    status,
  };
}

export const updatesActions: Actions['updates'] = {
  updateStatus,
};
