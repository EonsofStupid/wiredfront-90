import { logger } from '@/services/chat/LoggingService';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

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
}

export interface SettingsActions {
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
  saveDashboardLayout: (layout: DashboardLayout) => void;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
  updateCacheSettings: (settings: Partial<CacheSettings>) => void;
}

type SettingsStore = SettingsState & SettingsActions;

const defaultSettings: AppSettings = {
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

const defaultCacheSettings: CacheSettings = {
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

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        settings: defaultSettings,
        dashboardLayout: { panels: [] },
        notifications: {
          email: true,
          push: true,
          frequency: 'daily',
          types: ['alerts', 'updates'],
          marketing: false,
        },
        cache: defaultCacheSettings,

        updateSettings: (updates) => {
          set(state => ({
            settings: { ...state.settings, ...updates }
          }));
          logger.info('Settings updated', { updates });
        },

        resetSettings: () => {
          set({
            settings: defaultSettings,
            dashboardLayout: { panels: [] },
            notifications: {
              email: true,
              push: true,
              frequency: 'daily',
              types: ['alerts', 'updates'],
              marketing: false,
            },
            cache: defaultCacheSettings
          });
          logger.info('Settings reset to defaults');
        },

        saveDashboardLayout: (layout) => {
          set({ dashboardLayout: layout });
          logger.info('Dashboard layout saved', { layout });
        },

        updateNotifications: (settings) => {
          set(state => ({
            notifications: { ...state.notifications, ...settings }
          }));
          logger.info('Notification settings updated', { settings });
        },

        updateCacheSettings: (settings) => {
          set(state => ({
            cache: { ...state.cache, ...settings }
          }));
          logger.info('Cache settings updated', { settings });
        }
      }),
      {
        name: 'app-settings',
        partialize: (state) => ({
          settings: state.settings,
          dashboardLayout: state.dashboardLayout,
          notifications: state.notifications,
          cache: state.cache,
        })
      }
    ),
    {
      name: 'SettingsStore',
      enabled: process.env.NODE_ENV !== 'production'
    }
  )
);

// Selector hooks
export const useAppSettings = () => useSettingsStore(state => state.settings);
export const useDashboardLayout = () => useSettingsStore(state => state.dashboardLayout);
export const useNotificationSettings = () => useSettingsStore(state => state.notifications);
export const useCacheSettings = () => useSettingsStore(state => state.cache);
