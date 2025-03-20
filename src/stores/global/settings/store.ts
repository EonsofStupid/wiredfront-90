
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { SettingsState, SettingsStore } from './types';
import { UserPreferences } from '@/types/store/common/types';

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
    enabled: true,
    autoStart: true,
    logLevel: 'info'
  }
};

const initialState: SettingsState = {
  preferences: defaultPreferences,
  theme: 'system',
  isLoading: false,
  error: null
};

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        updatePreferences: (preferences) => {
          set((state) => ({
            preferences: {
              ...state.preferences,
              ...preferences
            }
          }));
        },

        setTheme: (theme) => {
          set({ theme });
        },

        resetSettings: () => {
          set(initialState);
        }
      }),
      {
        name: 'settings-storage',
        partialize: (state) => ({
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
export const usePreferences = () => useSettingsStore(state => state.preferences);
export const useTheme = () => useSettingsStore(state => state.theme);
export const useSettingsActions = () => ({
  updatePreferences: useSettingsStore(state => state.updatePreferences),
  setTheme: useSettingsStore(state => state.setTheme),
  resetSettings: useSettingsStore(state => state.resetSettings)
});
