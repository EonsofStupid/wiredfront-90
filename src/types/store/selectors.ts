import type { UIStore } from './ui';
import type { AuthStore } from './auth';
import type { DataStore } from './data';
import type { SettingsStore } from './settings';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { useDataStore } from '@/stores/data';
import { useSettingsStore } from '@/stores/settings';

export type StoreSelector<T> = (state: any) => T;

export interface StoreSelectors {
  selectTheme: StoreSelector<UIStore['theme']>;
  selectUser: StoreSelector<AuthStore['user']>;
  selectMetrics: StoreSelector<DataStore['metrics']>;
  selectDashboardLayout: StoreSelector<SettingsStore['dashboardLayout']>;
  selectNotificationSettings: StoreSelector<SettingsStore['notifications']>;
  selectCacheSettings: StoreSelector<SettingsStore['cache']>;
}

export const selectors: StoreSelectors = {
  selectTheme: () => useUIStore.getState().theme,
  selectUser: () => useAuthStore.getState().user,
  selectMetrics: () => Object.values(useDataStore.getState().metrics),
  selectDashboardLayout: () => useSettingsStore.getState().dashboardLayout,
  selectNotificationSettings: () => useSettingsStore.getState().notifications,
  selectCacheSettings: () => useSettingsStore.getState().cache,
};

// Custom hooks for accessing store data
export const useTheme = () => useUIStore((state) => state.theme);
export const useUser = () => useAuthStore((state) => state.user);
export const useMetrics = () => useDataStore((state) => Object.values(state.metrics));
export const useDashboardLayout = () => useSettingsStore((state) => state.dashboardLayout);
export const useNotificationSettings = () => useSettingsStore((state) => state.notifications);
export const useCacheSettings = () => useSettingsStore((state) => state.cache);