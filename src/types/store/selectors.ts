import type { UIStore } from './ui';
import type { AuthStore } from './auth';
import type { DataStore } from './data';
import type { SettingsStore } from './settings';
import type { DashboardMetric } from '../dashboard/metrics';

export type StoreSelector<T> = (state: any) => T;

export interface StoreSelectors {
  selectTheme: StoreSelector<UIStore['theme']>;
  selectUser: StoreSelector<AuthStore['user']>;
  selectMetrics: StoreSelector<Readonly<Record<string, DashboardMetric>>>;
  selectDashboardLayout: StoreSelector<SettingsStore['dashboardLayout']>;
  selectNotificationSettings: StoreSelector<SettingsStore['notifications']>;
  selectCacheSettings: StoreSelector<SettingsStore['cache']>;
}