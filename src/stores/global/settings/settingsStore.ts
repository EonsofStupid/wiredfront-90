import { logger } from '@/services/chat/LoggingService';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AppSettings {
  locale: string;
  prefersReducedMotion: boolean;
  developerMode: boolean;
}

interface SettingsState {
  settings: AppSettings;
}

interface SettingsActions {
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

type SettingsStore = SettingsState & SettingsActions;

const defaultSettings: AppSettings = {
  locale: 'en-US',
  prefersReducedMotion: false,
  developerMode: false
};

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        settings: defaultSettings,

        updateSettings: (updates) => {
          set(state => ({
            settings: { ...state.settings, ...updates }
          }));
          logger.info('Settings updated', { updates });
        },

        resetSettings: () => {
          set({ settings: defaultSettings });
          logger.info('Settings reset to defaults');
        }
      }),
      {
        name: 'app-settings'
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
