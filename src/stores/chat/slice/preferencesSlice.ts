import { StateCreator } from "zustand";
import { ChatState } from "../types";

export interface PreferencesSlice {
  // UI preferences state
  uiPreferences: {
    messageBehavior: {
      autoScroll: boolean;
      showTimestamps: boolean;
    };
    notifications: {
      enabled: boolean;
      sound: boolean;
    };
    soundEnabled: boolean;
    typingIndicators: boolean;
  };

  // UI preference actions
  setMessageBehavior: (behavior: {
    autoScroll?: boolean;
    showTimestamps?: boolean;
  }) => void;
  setNotificationSettings: (settings: {
    enabled?: boolean;
    sound?: boolean;
  }) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setTypingIndicators: (enabled: boolean) => void;
}

export const createPreferencesSlice: StateCreator<
  ChatState,
  [],
  [],
  PreferencesSlice
> = (set) => ({
  // Default state
  uiPreferences: {
    messageBehavior: {
      autoScroll: true,
      showTimestamps: false,
    },
    notifications: {
      enabled: true,
      sound: true,
    },
    soundEnabled: true,
    typingIndicators: true,
  },

  // Actions
  setMessageBehavior: (behavior) =>
    set((state) => ({
      uiPreferences: {
        ...state.uiPreferences,
        messageBehavior: {
          ...state.uiPreferences.messageBehavior,
          ...behavior,
        },
      },
    })),
  setNotificationSettings: (settings) =>
    set((state) => ({
      uiPreferences: {
        ...state.uiPreferences,
        notifications: {
          ...state.uiPreferences.notifications,
          ...settings,
        },
      },
    })),
  setSoundEnabled: (enabled) =>
    set((state) => ({
      uiPreferences: {
        ...state.uiPreferences,
        soundEnabled: enabled,
      },
    })),
  setTypingIndicators: (enabled) =>
    set((state) => ({
      uiPreferences: {
        ...state.uiPreferences,
        typingIndicators: enabled,
      },
    })),
});
