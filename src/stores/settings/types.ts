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

export interface UserPreferences {
  defaultView: string;
  refreshInterval: number;
  notifications: boolean;
  timezone: string;
  highContrast: boolean;
  reduceMotion: boolean;
  largeText: boolean;
  username: string;
  language: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  frequency: 'daily' | 'weekly' | 'realtime';
  types: string[];
  marketing: boolean;
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