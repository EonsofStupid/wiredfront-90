import { UIStore } from './ui';
import { AuthStore } from './auth';
import { DataStore } from './data';
import { SettingsStore } from './settings';

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

export * from './ui';
export * from './auth';
export * from './data';
export * from './settings';
export * from './common';