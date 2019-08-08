export interface State {
  updates: {
    status: string;
  };
}

export function getInitialState(): State {
  return {
    updates: {
      status: 'No updates found',
    },
  };
}
