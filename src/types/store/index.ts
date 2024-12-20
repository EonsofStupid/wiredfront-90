export * from './core';
export * from './auth';
export * from './settings';
export * from './ui';

export interface RootStore {
  version: string;
  lastUpdated: number;
}

// Store selector types
export type Selector<T> = (state: RootStore) => T;
export type Action<T> = (state: RootStore) => Partial<T>;