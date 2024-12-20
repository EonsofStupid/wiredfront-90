export type Status = 'idle' | 'loading' | 'error' | 'success';

export interface AsyncState {
  status: Status;
  error: string | null;
  lastUpdated: number | null;
}

export interface BaseState {
  version: string;
  initialized: boolean;
}

export type ActionType = string;

export interface Action<T extends ActionType = ActionType, P = unknown> {
  type: T;
  payload?: P;
}

export type Selector<T, R> = (state: T) => R;