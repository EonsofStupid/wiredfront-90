import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import type { SettingsStore, CacheSettings } from '@/types/store/settings';
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

// Initialize store with default values and proper typing
const initialState = {
  preferences: {
    defaultView: 'dashboard',
    refreshInterval: 30000,
    notifications: true,
    timezone: 'UTC',
  },
  dashboardLayout: {
    panels: [],
  },
  notifications: {
    email: true,
    push: true,
    frequency: 'daily' as const, // Explicitly type as literal
    types: ['alerts', 'updates'] as const,
  },
  cache: defaultCacheSettings,
};

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
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
    ),
    devtoolsConfig
  )
);