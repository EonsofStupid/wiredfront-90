import type { UIStore } from './ui';
import type { AuthStore } from './auth';
import type { DataStore } from './data';
import type { SettingsStore } from './settings';
import type { User, NotificationSettings } from './common';
import type { DashboardMetric } from '../dashboard/metrics';
import type { DashboardLayout } from '../dashboard/common';

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