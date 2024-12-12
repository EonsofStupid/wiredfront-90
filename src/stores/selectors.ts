import type { StoreSelector, StoreSelectors } from '@/types/store/selectors';
import { useUIStore } from './ui';
import { useAuthStore } from './auth';
import { useDataStore } from './data';
import { useSettingsStore } from './settings';

export const selectors: StoreSelectors = {
  selectTheme: (state) => useUIStore.getState().theme,
  selectUser: (state) => useAuthStore.getState().user,
  selectMetrics: (state) => Object.values(useDataStore.getState().metrics),
  selectDashboardLayout: (state) => useSettingsStore.getState().dashboardLayout,
  selectNotificationSettings: (state) => useSettingsStore.getState().notifications,
  selectCacheSettings: (state) => useSettingsStore.getState().cache,
};

// Custom hooks for accessing store data
export const useTheme = () => useUIStore((state) => state.theme);
export const useUser = () => useAuthStore((state) => state.user);
export const useMetrics = () => useDataStore((state) => Object.values(state.metrics));
export const useDashboardLayout = () => useSettingsStore((state) => state.dashboardLayout);
export const useNotificationSettings = () => useSettingsStore((state) => state.notifications);
export const useCacheSettings = () => useSettingsStore((state) => state.cache);