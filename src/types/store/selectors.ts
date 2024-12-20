import type { RootStore } from './index';
import type { User, NotificationSettings } from './common';
import type { DashboardMetric, DashboardLayout } from '../dashboard';

export type StoreSelector<T> = (state: RootStore) => T;

export interface StoreSelectors {
  selectTheme: StoreSelector<'light' | 'dark'>;
  selectUser: StoreSelector<User | null>;
  selectMetrics: StoreSelector<DashboardMetric[]>;
  selectDashboardLayout: StoreSelector<DashboardLayout>;
  selectNotificationSettings: StoreSelector<NotificationSettings>;
}

export type SelectorHook<T> = () => T;