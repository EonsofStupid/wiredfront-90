import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SettingsStore, SettingsAction, CacheSettings } from '@/types/store/settings';
import type { DevToolsConfig } from '@/types/store/middleware';

const persistConfig = {
  name: 'settings-storage',
  storage: {
    getItem: (name: string) => {
      const str = localStorage.getItem(name);
      if (!str) return null;
      try {
        return JSON.parse(str);
      } catch {
        return null;
      }
    },
    setItem: (name: string, value: any) => {
      localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name: string) => {
      localStorage.removeItem(name);
    },
  },
  partialize: (state: SettingsStore) => ({
    preferences: state.preferences,
    dashboardLayout: state.dashboardLayout,
    notifications: state.notifications,
    cache: state.cache,
  }),
};

const devtoolsConfig: DevToolsConfig = {
  name: 'Settings Store',
  enabled: process.env.NODE_ENV === 'development',
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
  persist(
    (set) => ({
      preferences: {
        defaultView: 'dashboard',
        refreshInterval: 30000,
        notifications: true,
        timezone: 'UTC',
        highContrast: false,
        reduceMotion: false,
        largeText: false,
        username: '',
        language: 'en',
      },
      dashboardLayout: {
        panels: [],
      },
      notifications: {
        email: true,
        push: true,
        frequency: 'daily',
        types: ['alerts', 'updates'],
        marketing: false,
      },
      cache: defaultCacheSettings,
      updatePreferences: (updates) => 
        set(
          (state) => ({
            preferences: { ...state.preferences, ...updates },
          }),
          false,
          { type: 'UPDATE_PREFERENCES', payload: updates }
        ),
      saveDashboardLayout: (layout) => 
        set(
          { dashboardLayout: layout },
          false,
          { type: 'SAVE_LAYOUT', payload: layout }
        ),
      updateNotifications: (settings) => 
        set(
          (state) => ({
            notifications: { ...state.notifications, ...settings },
          }),
          false,
          { type: 'UPDATE_NOTIFICATIONS', payload: settings }
        ),
      updateCacheSettings: (settings) =>
        set(
          (state) => ({
            cache: { ...state.cache, ...settings },
          }),
          false,
          { type: 'UPDATE_CACHE_SETTINGS', payload: settings }
        ),
    }),
    persistConfig
  )
);
