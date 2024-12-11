import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import type { SettingsStore } from '@/types/store/settings';
import type { PersistConfig, DevToolsConfig } from '@/types/store/middleware';

const persistConfig: PersistConfig = {
  name: 'settings-storage',
  storage: localStorage,
};

const devtoolsConfig: DevToolsConfig = {
  name: 'Settings Store',
  enabled: process.env.NODE_ENV === 'development',
};

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
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
          frequency: 'daily',
          types: ['alerts', 'updates'],
        },
        updatePreferences: (updates) => {
          set((state) => ({
            preferences: { ...state.preferences, ...updates },
          }));
        },
        saveDashboardLayout: (layout) => {
          set({ dashboardLayout: layout });
        },
        updateNotifications: (settings) => {
          set((state) => ({
            notifications: { ...state.notifications, ...settings },
          }));
        },
      }),
      persistConfig
    ),
    devtoolsConfig
  )
);