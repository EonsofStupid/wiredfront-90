
import { StateCreator } from 'zustand';
import { ChatState } from '../types';

export interface PreferencesSlice {
  // Preferences state
  uiPreferences: {
    messageBehavior: 'enter_send';
    notifications: boolean;
    soundEnabled: boolean;
    typingIndicators: boolean;
    showTimestamps: boolean;
  };
  
  // Preferences actions
  updatePreferences: (prefs: Partial<typeof PreferencesSlice.prototype.uiPreferences>) => void;
}

export const createPreferencesSlice: StateCreator<
  ChatState,
  [],
  [],
  PreferencesSlice
> = (set) => ({
  // Default state
  uiPreferences: {
    messageBehavior: 'enter_send',
    notifications: true,
    soundEnabled: true,
    typingIndicators: true,
    showTimestamps: true
  },
  
  // Actions
  updatePreferences: (prefs) => set((state) => ({
    uiPreferences: { ...state.uiPreferences, ...prefs }
  }))
});
