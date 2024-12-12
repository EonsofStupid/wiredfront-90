export * from './auth';
export * from './settings';
export * from './ui';
export * from './data';
export * from './middleware';
export * from './common';
export * from './actions';

// Re-export core types without conflicts
export type {
  Status,
  AsyncState,
  BaseState,
  CacheConfig,
  ValidationResult,
  ValidationError,
  RedisConfig,
} from './core';

// Re-export guards without conflicts
export {
  isUser,
  isValidAction,
  hasPayload,
  validateActionPayload,
} from './guards';

export type { StoreSelector, StoreSelectors } from './selectors';

export interface RootStore {
  version: string;
  lastUpdated: number;
}

// Store selector types
export type Selector<T> = (state: RootStore) => T;
export type Action<T> = (state: RootStore) => Partial<T>;