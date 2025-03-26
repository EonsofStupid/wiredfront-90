
import { StateCreator } from 'zustand';
import { ChatState } from '../types/chat-store-types';

export const createUIActions: StateCreator<ChatState, [], [], any> = (set) => ({
  toggleMinimize: () => {
    set((state) => ({ isMinimized: !state.isMinimized }));
  },

  toggleSidebar: () => {
    set((state) => ({ showSidebar: !state.showSidebar }));
  },

  toggleChat: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  // Generic UI state toggler
  toggleUIState: (key: keyof ChatState, value?: any) => {
    set((state) => ({ 
      [key]: value !== undefined ? value : !state[key] 
    }));
  },

  setSessionLoading: (isLoading: boolean) => {
    set({ 
      ui: {
        sessionLoading: isLoading,
        messageLoading: set.getState().ui.messageLoading,
        providerLoading: set.getState().ui.providerLoading
      }
    });
  },

  setMessageLoading: (isLoading: boolean) => {
    set({ 
      ui: {
        sessionLoading: set.getState().ui.sessionLoading,
        messageLoading: isLoading,
        providerLoading: set.getState().ui.providerLoading
      }
    });
  },

  setProviderLoading: (isLoading: boolean) => {
    set({ 
      ui: {
        sessionLoading: set.getState().ui.sessionLoading,
        messageLoading: set.getState().ui.messageLoading,
        providerLoading: isLoading
      }
    });
  },

  setScale: (scale: number) => {
    set({ scale });
  },

  setCurrentMode: (mode) => {
    set({ currentMode: mode });
  }
});
