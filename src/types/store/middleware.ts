import type { StateStorage } from 'zustand/middleware';
import type { RootStore } from './index';

export interface StorageValue<T> {
  state: T;
  version?: number;
}

export interface CustomStateStorage {
  getItem: (name: string) => string | null | Promise<string | null>;
  setItem: (name: string, value: string) => void | Promise<void>;
  removeItem: (name: string) => void | Promise<void>;
}

export interface PersistConfig<T extends object> {
  name: string;
  storage?: CustomStateStorage;
  version?: number;
  migrate?: (persistedState: unknown, version: number) => Promise<T> | T;
  skipHydration?: boolean;
  onRehydrateStorage?: (state: T) => ((state?: T, error?: Error) => void) | void;
  serialize?: (state: StorageValue<T>) => string;
  deserialize?: (str: string) => StorageValue<T>;
}

export interface DevToolsConfig {
  enabled?: boolean;
  name?: string;
  anonymousActionType?: string;
}