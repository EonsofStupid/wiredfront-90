import { StateCreator } from 'zustand';

export interface PersistOptions<T> {
  name: string;
  storage?: Storage;
  partialize?: (state: T) => Partial<T>;
  version?: number;
  migrate?: (persistedState: any, version: number) => T | Promise<T>;
}

export interface DevToolsConfig {
  name?: string;
  enabled?: boolean;
}

export type MiddlewareCreator = <T>(
  initializer: StateCreator<T>
) => StateCreator<T>;

export interface StoreMiddlewareConfig<T> {
  persist?: PersistOptions<T>;
  devtools?: DevToolsConfig;
}