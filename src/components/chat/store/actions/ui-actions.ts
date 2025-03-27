
import { StateCreator } from 'zustand';
import { ChatState } from '../types/chat-store-types';

export const createUIActions: StateCreator<ChatState, [], [], any> = (set, get) => ({
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
        messageLoading: get().ui.messageLoading,
        providerLoading: get().ui.providerLoading
      }
    });
  },

  setMessageLoading: (isLoading: boolean) => {
    set({ 
      ui: {
        sessionLoading: get().ui.sessionLoading,
        messageLoading: isLoading,
        providerLoading: get().ui.providerLoading
      }
    });
  },

  setProviderLoading: (isLoading: boolean) => {
    set({ 
      ui: {
        sessionLoading: get().ui.sessionLoading,
        messageLoading: get().ui.messageLoading,
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
