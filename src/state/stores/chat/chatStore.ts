
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatFeature, ChatPreferences, ChatState } from '../../types/chat';

const defaultPreferences: ChatPreferences = {
  position: { x: 0, y: 0 },
  scale: 1,
  isDocked: true,
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
  modeSwitch: {
    id: 'modeSwitch',
    name: 'Mode Switching',
    description: 'Enable switching between chat modes',
    isEnabled: true,
  },
  saveHistory: {
    id: 'saveHistory',
    name: 'Save History',
    description: 'Save chat history between sessions',
    isEnabled: true,
  },
  showTimestamps: {
    id: 'showTimestamps',
    name: 'Show Timestamps',
    description: 'Show timestamps for chat messages',
    isEnabled: true,
  },
  startMinimized: {
    id: 'startMinimized',
    name: 'Start Minimized',
    description: 'Start chat in minimized state',
    isEnabled: false,
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
      isDocked: true,

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
      partialize: (state) => ({
        preferences: state.preferences,
        features: state.features,
        selectedModel: state.selectedModel,
        currentMode: state.currentMode,
      }),
    }
  )
);
