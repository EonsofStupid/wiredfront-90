import type { StateCreator, StoreMutatorIdentifier } from 'zustand';
import type { DevToolsConfig } from './types';

export interface PersistOptions<T> {
  name: string;
  storage?: Storage;
  partialize?: (state: T) => Partial<T>;
  version?: number;
  migrate?: (persistedState: any, version: number) => T | Promise<T>;
}

export type MiddlewareCreator = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  initializer: StateCreator<T, Mps, Mcs>
) => StateCreator<T, Mps, Mcs>;

export interface StoreMiddlewareConfig<T> {
  persist?: PersistOptions<T>;
  devtools?: DevToolsConfig;
}