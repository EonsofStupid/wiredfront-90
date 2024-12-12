import type { BaseAction } from './common';
import type { CacheConfig } from './core';

export interface CacheState {
  readonly config: Readonly<CacheConfig>;
  readonly size: number;
  readonly lastCleared: number | null;
}

export interface CacheActions {
  readonly updateConfig: (config: Partial<CacheConfig>) => void;
  readonly clearCache: () => void;
  readonly invalidateKey: (key: string) => void;
}

export type CacheStore = Readonly<CacheState & CacheActions>;

export type CacheActionType =
  | 'UPDATE_CONFIG'
  | 'CLEAR_CACHE'
  | 'INVALIDATE_KEY';

export type CacheAction =
  | BaseAction<'UPDATE_CONFIG', Partial<CacheConfig>>
  | BaseAction<'CLEAR_CACHE'>
  | BaseAction<'INVALIDATE_KEY', string>;