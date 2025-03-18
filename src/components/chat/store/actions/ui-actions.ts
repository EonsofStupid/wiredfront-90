
import { StateCreator } from 'zustand';
import { ChatState } from '../types/chat-store-types';

export const createUIActions = (
  set: (
    partial: ChatState | Partial<ChatState> | ((state: ChatState) => ChatState | Partial<ChatState>), 
    replace?: boolean, 
    action?: { type: string; [key: string]: any }
  ) => void,
  get: () => ChatState
) => ({
  setSessionLoading: (loading: boolean) => {
    set((state) => ({
      ui: {
        ...state.ui,
        sessionLoading: loading,
      },
    }), false, { type: 'chat/setSessionLoading', loading });
  },
  
  setMessageLoading: (loading: boolean) => {
    set((state) => ({
      ui: {
        ...state.ui,
        messageLoading: loading,
      },
    }), false, { type: 'chat/setMessageLoading', loading });
  },
  
  setProviderLoading: (loading: boolean) => {
    set((state) => ({
      ui: {
        ...state.ui,
        providerLoading: loading,
      },
    }), false, { type: 'chat/setProviderLoading', loading });
  },
  
  setWaitingForResponse: (isWaiting: boolean) => {
    set({ isWaitingForResponse: isWaiting }, false, { type: 'chat/setWaitingForResponse', isWaiting });
  },
  
  toggleChat: () => {
    set((state) => ({ isOpen: !state.isOpen }), false, { type: 'chat/toggleChat' });
  },
  
  openChat: () => {
    set({ isOpen: true }, false, { type: 'chat/openChat' });
  },
  
  closeChat: () => {
    set({ isOpen: false }, false, { type: 'chat/closeChat' });
  },
  
  // Enhanced position toggling with localStorage persistence
  togglePosition: () => {
    const newPosition = get().position === 'bottom-right' ? 'bottom-left' : 'bottom-right';
    
    // Save to localStorage to persist between sessions
    try {
      localStorage.setItem('chat-position', newPosition);
    } catch (e) {
      console.error('Failed to save chat position to localStorage', e);
    }
    
    set({ position: newPosition }, false, { type: 'chat/togglePosition', position: newPosition });
  },
  
  // Load saved position from localStorage
  loadSavedPosition: () => {
    try {
      const savedPosition = localStorage.getItem('chat-position');
      if (savedPosition === 'bottom-left' || savedPosition === 'bottom-right') {
        set({ position: savedPosition }, false, { type: 'chat/loadSavedPosition', position: savedPosition });
      }
    } catch (e) {
      console.error('Failed to load chat position from localStorage', e);
    }
  }
});
