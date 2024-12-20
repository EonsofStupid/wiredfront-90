import type { StoreSelector, StoreSelectors } from '@/types/store/selectors';
import { useUIStore } from './ui';
import { useAuthStore } from './auth';
import { useDataStore } from './data';
import { useSettingsStore } from './settings';
import type { UIState } from '@/types/store/ui';
import type { AuthState } from '@/types/store/auth';
import type { DataState } from '@/types/store/data';
import type { SettingsState } from '@/types/store/settings';

// Type-safe selectors
export const selectors: StoreSelectors = {
  selectTheme: (state: UIState) => state.theme,
  selectUser: (state: AuthState) => state.user,
  selectMetrics: (state: DataState) => state.metrics,
  selectDashboardLayout: (state: SettingsState) => state.dashboardLayout,
  selectNotificationSettings: (state: SettingsState) => state.notifications,
  selectCacheSettings: (state: SettingsState) => state.cache,
};

// Custom hooks for accessing store data with proper typing
export const useTheme = () => useUIStore((state) => state.theme);
export const useUser = () => useAuthStore((state) => state.user);
export const useMetrics = () => useDataStore((state) => state.metrics);
export const useDashboardLayout = () => useSettingsStore((state) => state.dashboardLayout);
export const useNotificationSettings = () => useSettingsStore((state) => state.notifications);
export const useCacheSettings = () => useSettingsStore((state) => state.cache);

// Type guard to ensure selector type safety
export const createSelector = <T, R>(selector: StoreSelector<T, R>): StoreSelector<T, R> => selector;