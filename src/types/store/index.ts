export * from './auth';
export * from './settings';
export * from './ui';
export * from './data';
export * from './selectors';
export * from './middleware';
export * from './common';
export * from './actions';
export * from './guards';
export * from './state';

// Re-export core types without conflicts
export type { 
  Status,
  AsyncState,
  BaseState,
  CacheConfig,
  ValidationResult,
  ValidationError
} from './core';

export interface RootStore {
  version: string;
  lastUpdated: number;
}

// Store selector types
export type Selector<T> = (state: RootStore) => T;
export type Action<T> = (state: RootStore) => Partial<T>;