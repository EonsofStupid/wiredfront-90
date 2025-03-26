
import { StateCreator } from 'zustand';
import { ChatState } from '../types/chat-store-types';

export const createUIActions: StateCreator<ChatState, [], [], any> = (set) => ({
  toggleMinimize: () => {
    set((state) => ({ isMinimized: !state.isMinimized }), false, 'chat/toggleMinimize');
  },

  toggleSidebar: () => {
    set((state) => ({ showSidebar: !state.showSidebar }), false, 'chat/toggleSidebar');
  },

  toggleChat: () => {
    set((state) => ({ isOpen: !state.isOpen }), false, 'chat/toggleChat');
  },

  // Generic UI state toggler
  toggleUIState: (key: keyof ChatState, value?: any) => {
    set((state) => ({ 
      [key]: value !== undefined ? value : !state[key] 
    }), false, `chat/toggleUIState/${String(key)}`);
  },

  setSessionLoading: (isLoading: boolean) => {
    set((state) => ({
      ui: {
        ...state.ui,
        sessionLoading: isLoading
      }
    }), false, 'chat/setSessionLoading');
  },

  setMessageLoading: (isLoading: boolean) => {
    set((state) => ({
      ui: {
        ...state.ui,
        messageLoading: isLoading
      }
    }), false, 'chat/setMessageLoading');
  },

  setProviderLoading: (isLoading: boolean) => {
    set((state) => ({
      ui: {
        ...state.ui,
        providerLoading: isLoading
      }
    }), false, 'chat/setProviderLoading');
  },

  setScale: (scale: number) => {
    set({ scale }, false, 'chat/setScale');
  },

  setCurrentMode: (mode) => {
    set({ currentMode: mode }, false, 'chat/setCurrentMode');
  }
});
