import { logger } from '@/services/chat/LoggingService';
import type { UserPreferences } from '@/types/store/common/types';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
    SettingsStore
} from './types';
import {
    defaultCacheSettings,
    defaultSettings
} from './types';

const defaultPreferences: UserPreferences = {
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
        preferences: defaultPreferences,
        theme: 'system',
        isLoading: false,
        error: null,

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
            cache: defaultCacheSettings,
            preferences: defaultPreferences,
            theme: 'system',
            isLoading: false,
            error: null
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
        },

        updatePreferences: (preferences) => {
          set(state => ({
            preferences: { ...state.preferences, ...preferences }
          }));
          logger.info('Preferences updated', { preferences });
        },

        setTheme: (theme) => {
          set({ theme });
          logger.info('Theme updated', { theme });
        }
      }),
      {
        name: 'app-settings',
        partialize: (state) => ({
          settings: state.settings,
          dashboardLayout: state.dashboardLayout,
          notifications: state.notifications,
          cache: state.cache,
          preferences: state.preferences,
          theme: state.theme
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
export const usePreferences = () => useSettingsStore(state => state.preferences);
export const useTheme = () => useSettingsStore(state => state.theme);
