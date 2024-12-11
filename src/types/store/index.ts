import type { UIStore, UIAction } from './ui';
import type { AuthStore, AuthAction } from './auth';
import type { DataStore, DataAction } from './data';
import type { SettingsStore, SettingsAction } from './settings';
import type { User, NotificationSettings } from './common';
import type { DashboardMetric, DashboardLayout } from '../dashboard';

export interface RootStore {
  ui: UIStore;
  auth: AuthStore;
  data: DataStore;
  settings: SettingsStore;
}

export interface StoreSelectors {
  selectTheme: () => 'light' | 'dark';
  selectUser: () => User | null;
  selectMetrics: () => DashboardMetric[];
  selectDashboardLayout: () => DashboardLayout;
  selectNotificationSettings: () => NotificationSettings;
}

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
  NotificationSettings
};