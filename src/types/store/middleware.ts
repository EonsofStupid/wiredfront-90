import { StateStorage } from 'zustand/middleware';
import type { RootStore } from './index';

// Define the correct storage value type
type StorageValue<T> = {
  state: T;
  version?: number;
};

// Extend the StateStorage type to ensure proper typing
export interface CustomStateStorage extends StateStorage {
  getItem: (name: string) => Promise<string | null> | string | null;
  setItem: (name: string, value: string) => Promise<void> | void;
  removeItem: (name: string) => Promise<void> | void;
}

export interface PersistConfig {
  name?: string;
  storage?: CustomStateStorage;
  version?: number;
  migrate?: (persistedState: unknown, version: number) => Promise<RootStore> | RootStore;
  skipHydration?: boolean;
  onRehydrateStorage?: (state: RootStore) => ((state?: RootStore, error?: Error) => void) | void;
  serialize?: (state: StorageValue<RootStore>) => string;
  deserialize?: (str: string) => StorageValue<RootStore>;
}

export interface DevToolsConfig {
  enabled?: boolean;
  name?: string;
  anonymousActionType?: string;
}

export type StoreMiddleware = {
  persist?: PersistConfig;
  devtools?: DevToolsConfig;
};