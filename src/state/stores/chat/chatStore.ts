import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatFeature, ChatPreferences, ChatState } from '../../types/chat';

const defaultPreferences: ChatPreferences = {
  position: { x: 0, y: 0 },
  scale: 1,
  isDocked: false,
  isMinimized: false,
  showSidebar: false,
  theme: 'system',
  fontSize: 'medium',
  showTimestamps: true,
  saveHistory: true,
};

const defaultFeatures: Record<string, ChatFeature> = {
  notifications: {
    id: 'notifications',
    name: 'Notifications',
    description: 'Show chat notifications',
    isEnabled: true,
  },
  github: {
    id: 'github',
    name: 'GitHub Integration',
    description: 'Enable GitHub integration',
    isEnabled: true,
  },
  knowledge: {
    id: 'knowledge',
    name: 'Knowledge Base',
    description: 'Enable knowledge base integration',
    isEnabled: true,
  },
};

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      // UI State
      isOpen: false,
      isMinimized: false,
      showSidebar: false,
      position: { x: 0, y: 0 },
      scale: 1,
      isDocked: false,

      // Chat State
      currentMode: 'chat',
      selectedModel: 'gpt-3.5-turbo',
      currentProvider: null,
      availableProviders: [],

      // Preferences
      preferences: defaultPreferences,

      // Features
      features: defaultFeatures,

      // Actions
      toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
      toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),
      toggleSidebar: () => set((state) => ({ showSidebar: !state.showSidebar })),
      setPosition: (position) => set({ position }),
      setScale: (scale) => set({ scale }),
      setDocked: (isDocked) => set({ isDocked }),
      setCurrentMode: (mode) => set({ currentMode: mode }),
      setSelectedModel: (model) => set({ selectedModel: model }),
      updateCurrentProvider: (provider) => set({ currentProvider: provider }),
      updatePreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs }
        })),
      toggleFeature: (featureId) =>
        set((state) => ({
          features: {
            ...state.features,
            [featureId]: {
              ...state.features[featureId],
              isEnabled: !state.features[featureId].isEnabled,
            },
          },
        })),
      resetToDefaults: () => set({
        preferences: defaultPreferences,
        features: defaultFeatures,
      }),
    }),
    {
      name: 'chat-store',
    }
  )
);
