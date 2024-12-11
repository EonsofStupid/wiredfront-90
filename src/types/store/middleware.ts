import type { StateStorage } from 'zustand/middleware';
import type { RootStore } from './index';

export interface StorageValue<T> {
  state: T;
  version?: number;
}

export interface CustomStateStorage extends StateStorage {
  getItem: <T>(name: string) => Promise<StorageValue<T> | null> | StorageValue<T> | null;
  setItem: <T>(name: string, value: StorageValue<T>) => Promise<void> | void;
  removeItem: (name: string) => Promise<void> | void;
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

export type StoreMiddleware = {
  persist?: PersistConfig<Partial<RootStore>>;
  devtools?: DevToolsConfig;
};