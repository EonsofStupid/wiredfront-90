import type { UIStore, UIAction } from './ui';
import type { AuthStore, AuthAction } from './auth';
import type { DataStore, DataAction } from './data';
import type { SettingsStore, SettingsAction } from './settings';
import type { User, NotificationSettings } from './common';
import type { DashboardMetric, DashboardLayout } from '../dashboard';
import type { DevToolsConfig, PersistConfig } from './middleware';
import type { StoreSelectors, SelectorHook } from './selectors';

export interface RootStore {
  ui: UIStore;
  auth: AuthStore;
  data: DataStore;
  settings: SettingsStore;
}

export interface StoreConfig<T extends object> {
  persist?: PersistConfig<T>;
  devtools?: DevToolsConfig;
  selectors?: StoreSelectors;
}

export type RootAction = UIAction | AuthAction | DataAction | SettingsAction;

export type { 
  UIStore, 
  UIAction,
  AuthStore, 
  AuthAction,
  DataStore, 
  DataAction,
  SettingsStore, 
  SettingsAction,
  User,
  NotificationSettings,
  DevToolsConfig,
  StoreSelectors,
  SelectorHook
};