
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
  toggleChat: () => {
    set((state) => ({
      isOpen: !state.isOpen,
      // Reset minimized state when opening
      ...(state.isOpen ? {} : { isMinimized: false }),
    }), false, { type: 'chat/toggleChat' });
  },
  
  closeChat: () => {
    set({
      isOpen: false,
    }, false, { type: 'chat/closeChat' });
  },
  
  openChat: () => {
    set({
      isOpen: true,
      isMinimized: false,
    }, false, { type: 'chat/openChat' });
  },
  
  toggleMinimize: () => {
    set((state) => ({
      isMinimized: !state.isMinimized,
    }), false, { type: 'chat/toggleMinimize' });
  },
  
  toggleSidebar: () => {
    set((state) => ({
      showSidebar: !state.showSidebar,
    }), false, { type: 'chat/toggleSidebar' });
  },
  
  setSessionLoading: (isLoading: boolean) => {
    set((state) => ({
      ui: {
        ...state.ui,
        sessionLoading: isLoading,
      },
    }), false, { type: 'chat/setSessionLoading', isLoading });
  },
  
  setMessageLoading: (isLoading: boolean) => {
    set((state) => ({
      ui: {
        ...state.ui,
        messageLoading: isLoading,
      },
    }), false, { type: 'chat/setMessageLoading', isLoading });
  },
  
  setProviderLoading: (isLoading: boolean) => {
    set((state) => ({
      ui: {
        ...state.ui,
        providerLoading: isLoading,
      },
    }), false, { type: 'chat/setProviderLoading', isLoading });
  },
});
