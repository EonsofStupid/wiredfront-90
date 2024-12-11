import { PersistOptions } from 'zustand/middleware/persist';
import { StateStorage } from 'zustand/middleware';
import { RootStore } from './index';

export interface PersistConfig extends PersistOptions<RootStore, RootStore> {
  storage?: StateStorage;
  version?: number;
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