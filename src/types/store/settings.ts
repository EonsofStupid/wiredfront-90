import type { BaseAction } from './common/types';
import type { NotificationSettings, UserPreferences } from './common/types';
import type { DashboardLayout } from '@/types/dashboard/common';

export interface RedisConfig {
  host: string;
  port: number;
  tls: boolean;
  database: number;
}

export interface CacheSettings {
  enabled: boolean;
  ttl: number;
  maxSize: number;
  redis: RedisConfig;
}

export interface SettingsState {
  readonly preferences: Readonly<UserPreferences>;
  readonly dashboardLayout: Readonly<DashboardLayout>;
  readonly notifications: Readonly<NotificationSettings>;
  readonly cache: Readonly<CacheSettings>;
}

export interface SettingsActions {
  readonly updatePreferences: (updates: Partial<UserPreferences>) => void;
  readonly saveDashboardLayout: (layout: DashboardLayout) => void;
  readonly updateNotifications: (settings: Partial<NotificationSettings>) => void;
  readonly updateCacheSettings: (settings: Partial<CacheSettings>) => void;
}

export type SettingsStore = Readonly<SettingsState & SettingsActions>;

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