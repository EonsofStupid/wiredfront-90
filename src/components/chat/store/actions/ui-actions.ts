
import { StateCreator } from 'zustand';
import { ChatState } from '../types/chat-store-types';

export const createUIActions = <T extends ChatState>(
  set: StateCreator<T>['setState'],
  get: () => T
) => ({
  toggleMinimize: () => {
    set({ isMinimized: !get().isMinimized }, false, { type: 'chat/toggleMinimize' });
  },
  
  toggleChat: () => {
    set({ isOpen: !get().isOpen }, false, { type: 'chat/toggleChat' });
  },
  
  closeChat: () => {
    set({ isOpen: false }, false, { type: 'chat/closeChat' });
  },
  
  openChat: () => {
    set({ isOpen: true }, false, { type: 'chat/openChat' });
  },
  
  toggleSidebar: () => {
    set({ showSidebar: !get().showSidebar }, false, { type: 'chat/toggleSidebar' });
  },
  
  setSessionLoading: (loading: boolean) => {
    set(state => ({
      ui: {
        ...state.ui,
        sessionLoading: loading
      }
    }), false, { type: 'chat/setSessionLoading', loading });
  },
  
  setMessageLoading: (loading: boolean) => {
    set(state => ({
      ui: {
        ...state.ui,
        messageLoading: loading
      }
    }), false, { type: 'chat/setMessageLoading', loading });
  },
  
  setProviderLoading: (loading: boolean) => {
    set(state => ({
      ui: {
        ...state.ui,
        providerLoading: loading
      }
    }), false, { type: 'chat/setProviderLoading', loading });
  },
  
  setWaitingForResponse: (waiting: boolean) => {
    set({ isWaitingForResponse: waiting }, false, { type: 'chat/setWaitingForResponse', waiting });
  }
});
