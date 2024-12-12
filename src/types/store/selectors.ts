import type { StoreSelector } from './index';
import type { User, NotificationSettings } from './common';
import type { DashboardMetric, DashboardLayout } from '../dashboard';
import type { CacheSettings } from './settings';

export interface StoreSelectors {
  selectTheme: StoreSelector<'light' | 'dark'>;
  selectUser: StoreSelector<User | null>;
  selectMetrics: StoreSelector<DashboardMetric[]>;
  selectDashboardLayout: StoreSelector<DashboardLayout>;
  selectNotificationSettings: StoreSelector<NotificationSettings>;
  selectCacheSettings: StoreSelector<CacheSettings>;
}

// Custom hooks for accessing store data
export const useTheme = () => useUIStore((state) => state.theme);
export const useUser = () => useAuthStore((state) => state.user);
export const useMetrics = () => useDataStore((state) => Object.values(state.metrics));
export const useDashboardLayout = () => useSettingsStore((state) => state.dashboardLayout);
export const useNotificationSettings = () => useSettingsStore((state) => state.notifications);
export const useCacheSettings = () => useSettingsStore((state) => state.cache);

export const selectors: StoreSelectors = {
  selectTheme: (state) => useUIStore.getState().theme,
  selectUser: (state) => useAuthStore.getState().user,
  selectMetrics: (state) => Object.values(useDataStore.getState().metrics),
  selectDashboardLayout: (state) => useSettingsStore.getState().dashboardLayout,
  selectNotificationSettings: (state) => useSettingsStore.getState().notifications,
  selectCacheSettings: (state) => useSettingsStore.getState().cache,
};