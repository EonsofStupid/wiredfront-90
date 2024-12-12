import type { BaseAction } from './common';
import type { NotificationSettings, UserPreferences } from './common';
import type { DashboardLayout } from '../dashboard/common';

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  tls?: boolean;
  database?: number;
  prefix?: string;
}

export interface CacheSettings {
  enabled: boolean;
  ttl: number;
  maxSize: number;
  redis?: RedisConfig;
}

export interface SettingsState {
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

export type SettingsActionType =
  | 'UPDATE_PREFERENCES'
  | 'SAVE_LAYOUT'
  | 'UPDATE_NOTIFICATIONS'
  | 'UPDATE_CACHE_SETTINGS';

export type SettingsAction = 
  | BaseAction<'UPDATE_PREFERENCES', Partial<UserPreferences>>
  | BaseAction<'SAVE_LAYOUT', DashboardLayout>
  | BaseAction<'UPDATE_NOTIFICATIONS', Partial<NotificationSettings>>
  | BaseAction<'UPDATE_CACHE_SETTINGS', Partial<CacheSettings>>;