import type { StateStorage } from 'zustand/middleware';

export interface StorageValue<T> {
  state: T;
  version?: number;
}

export interface PersistConfig<T extends object> {
  name: string;
  storage?: StateStorage;
  version?: number;
  migrate?: (persistedState: unknown, version: number) => Promise<T> | T;
  skipHydration?: boolean;
  onRehydrateStorage?: (state: T) => ((state?: T, error?: Error) => void) | void;
  partialize?: (state: T) => Partial<T>;
}

export interface DevToolsConfig {
  enabled?: boolean;
  name?: string;
  anonymousActionType?: string;
}