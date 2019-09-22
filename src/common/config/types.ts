export type OnChangeCallback = (newValue: any, oldValue: any) => void;
export type OnAnyChangeCallback = (newValue: any, oldValue: any) => void;

export interface OnChangeEvent {
  type: 'onChange';
  payload: {
    key: string;
    newValue: any;
    oldValue: any;
  };
}

export interface OnAnyChangeEvent {
  type: 'onAnyChange';
  payload: {
    newValue: any;
    oldValue: any;
  };
}

export interface OnChangeKeyEvent {
  type: 'onChangeKey';
  payload: {
    key: string;
  };
}

export interface NewClientEvent {
  type: 'newClient';
}

export type ConfigEvent = OnChangeEvent | OnAnyChangeEvent | OnChangeKeyEvent | NewClientEvent;
