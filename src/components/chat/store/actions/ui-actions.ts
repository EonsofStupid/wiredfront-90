
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
    set(
      (state) => ({ 
        isOpen: !state.isOpen,
        isMinimized: false, // Reset minimized state when toggling
        isHidden: false     // Make sure chat is not hidden
      }), 
      false, 
      { type: 'chat/toggleChat' }
    );
    // Log the action for debugging
    console.log('Chat toggled', { now: new Date().toISOString(), isOpen: !get().isOpen });
  },
  
  openChat: () => {
    set({ isOpen: true, isHidden: false }, false, { type: 'chat/openChat' });
  },
  
  closeChat: () => {
    set({ isOpen: false }, false, { type: 'chat/closeChat' });
  }
});
