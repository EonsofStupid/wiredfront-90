import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import type { SettingsStore } from './types';
import type { DevToolsConfig } from '../core/middleware';

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

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        version: '1.0.0',
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
        cache: {
          enabled: false,
          ttl: 3600,
          maxSize: 100,
          redis: {
            host: 'localhost',
            port: 6379,
            tls: false,
            database: 0,
          },
        },
        updatePreferences: (updates) => 
          set(
            (state) => ({
              preferences: { ...state.preferences, ...updates },
            })
          ),
        saveDashboardLayout: (layout) => 
          set({ dashboardLayout: layout }),
        updateNotifications: (settings) => 
          set(
            (state) => ({
              notifications: { ...state.notifications, ...settings },
            })
          ),
        updateCacheSettings: (settings) =>
          set(
            (state) => ({
              cache: { ...state.cache, ...settings },
            })
          ),
      }),
      persistConfig
    ),
    devtoolsConfig
  )
);