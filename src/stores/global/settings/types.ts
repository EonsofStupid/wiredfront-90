import { UserPreferences } from '@/types/store/common/types';

export interface AppSettings {
  locale: string;
  prefersReducedMotion: boolean;
  developerMode: boolean;
  defaultView: string;
  refreshInterval: number;
  notifications: boolean;
  timezone: string;
  highContrast: boolean;
  reduceMotion: boolean;
  largeText: boolean;
  username: string;
  language: string;
  livePreview: {
    enabled: boolean;
    autoStart: boolean;
    logLevel: string;
  };
}

export interface DashboardLayout {
  panels: any[];
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  frequency: string;
  types: string[];
  marketing: boolean;
}

export interface CacheSettings {
  enabled: boolean;
  ttl: number;
  maxSize: number;
  redis: {
    host: string;
    port: number;
    tls: boolean;
    database: number;
  };
}

export interface SettingsState {
  settings: AppSettings;
  dashboardLayout: DashboardLayout;
  notifications: NotificationSettings;
  cache: CacheSettings;
  preferences: UserPreferences;
  theme: 'light' | 'dark' | 'system';
  isLoading: boolean;
  error: Error | null;
}

export interface SettingsActions {
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
  saveDashboardLayout: (layout: DashboardLayout) => void;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
  updateCacheSettings: (settings: Partial<CacheSettings>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  setTheme: (theme: SettingsState['theme']) => void;
}

export type SettingsStore = SettingsState & SettingsActions;

// Default values
export const defaultSettings: AppSettings = {
  locale: 'en-US',
  prefersReducedMotion: false,
  developerMode: false,
  defaultView: 'dashboard',
  refreshInterval: 30000,
  notifications: true,
  timezone: 'UTC',
  highContrast: false,
  reduceMotion: false,
  largeText: false,
  username: '',
  language: 'en',
  livePreview: {
    enabled: false,
    autoStart: false,
    logLevel: 'info'
  }
};

export const defaultCacheSettings: CacheSettings = {
  enabled: false,
  ttl: 3600,
  maxSize: 100,
  redis: {
    host: 'localhost',
    port: 6379,
    tls: false,
    database: 0,
  },
};
