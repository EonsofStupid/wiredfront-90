import type { StateCreator } from 'zustand';

// Basic type definitions
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

// Store middleware types
export type StoreMiddleware<T> = StateCreator<T>;

// Store action types
export type ActionType = string;

export interface Action<T extends ActionType = ActionType, P = unknown> {
  type: T;
  payload?: P;
}

// Store selector types
export type Selector<T, R> = (state: T) => R;

// Utility type for creating store slices
export type StateSlice<T extends object, K extends keyof T = keyof T> = Pick<T, K>;

// Type guard utilities
export const isAsyncState = (value: unknown): value is AsyncState => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    'error' in value &&
    'lastUpdated' in value
  );
};

export const isAction = <T extends ActionType>(
  value: unknown,
  type: T
): value is Action<T> => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    value.type === type
  );
};