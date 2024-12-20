import type { UserPreferences, NotificationSettings } from '@/types/store/common';
import type { DashboardLayout } from '@/types/dashboard/common';
import type { CacheConfig, RedisConfig } from '../core/types';

export interface CacheSettings {
  enabled: boolean;
  ttl: number;
  maxSize: number;
  redis?: RedisConfig;
}

export interface SettingsState {
  version: string;
  preferences: UserPreferences;
  dashboardLayout: DashboardLayout;
  notifications: NotificationSettings;
  cache: CacheSettings;
}

export interface SettingsActions {
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  saveDashboardLayout: (layout: DashboardLayout) => void;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
  updateCacheSettings: (settings: Partial<CacheSettings>) => void;
}

export type SettingsStore = SettingsState & SettingsActions;