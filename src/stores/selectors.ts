import type { StoreSelector, StoreSelectors } from '@/types/store/selectors';
import { useUIStore } from './ui';
import { useAuthStore } from './auth';
import { useDataStore } from './data';
import { useSettingsStore } from './settings';

export const selectors: StoreSelectors = {
  selectTheme: () => useUIStore.getState().theme,
  selectUser: () => useAuthStore.getState().user,
  selectMetrics: () => useDataStore.getState().metrics,
  selectDashboardLayout: () => useSettingsStore.getState().dashboardLayout,
  selectNotificationSettings: () => useSettingsStore.getState().notifications,
  selectCacheSettings: () => useSettingsStore.getState().cache,
};

// Custom hooks for accessing store data
export const useTheme = () => useUIStore((state) => state.theme);
export const useUser = () => useAuthStore((state) => state.user);
export const useMetrics = () => Object.values(useDataStore((state) => state.metrics));
export const useDashboardLayout = () => useSettingsStore((state) => state.dashboardLayout);
export const useNotificationSettings = () => useSettingsStore((state) => state.notifications);
export const useCacheSettings = () => useSettingsStore((state) => state.cache);