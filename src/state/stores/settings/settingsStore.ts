import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SettingsPreferences, SettingsSection, SettingsState } from '../../types/settings';

const defaultPreferences: SettingsPreferences = {
  theme: 'system',
  fontSize: 'medium',
  animations: true,
  notifications: true,
  autoSave: true,
  language: 'en',
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
};

const defaultSections: Record<string, SettingsSection> = {
  general: {
    id: 'general',
    name: 'General',
    description: 'General application settings',
    icon: 'settings',
    isEnabled: true,
  },
  chat: {
    id: 'chat',
    name: 'Chat',
    description: 'Chat preferences and behavior',
    icon: 'message-square',
    isEnabled: true,
  },
  github: {
    id: 'github',
    name: 'GitHub',
    description: 'GitHub integration settings',
    icon: 'github',
    isEnabled: true,
  },
  profile: {
    id: 'profile',
    name: 'Profile',
    description: 'User profile settings',
    icon: 'user',
    isEnabled: true,
  },
  api: {
    id: 'api',
    name: 'API',
    description: 'API configuration and keys',
    icon: 'key',
    isEnabled: true,
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // UI State
      activeSection: null,
      isOpen: false,

      // Settings State
      sections: defaultSections,
      preferences: defaultPreferences,

      // Actions
      setActiveSection: (sectionId) => set({ activeSection: sectionId }),
      toggleSettings: () => set((state) => ({ isOpen: !state.isOpen })),
      updatePreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),
      toggleSection: (sectionId) =>
        set((state) => ({
          sections: {
            ...state.sections,
            [sectionId]: {
              ...state.sections[sectionId],
              isEnabled: !state.sections[sectionId].isEnabled,
            },
          },
        })),
      resetToDefaults: () => set({
        preferences: defaultPreferences,
        sections: defaultSections,
      }),
    }),
    {
      name: 'settings-store',
    }
  )
);
