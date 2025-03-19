
import { StateCreator } from 'zustand';
import { ChatState } from '../types/chat-store-types';
import { logger } from '@/services/chat/LoggingService';

export const createUIActions = <T extends ChatState>(
  set: StateCreator<T>['setState'],
  get: () => T
) => ({
  toggleMinimize: () => {
    const isMinimized = !get().isMinimized;
    set({ isMinimized }, false, { 
      type: 'chat/toggleMinimize',
      isMinimized
    });
    logger.info(`Chat minimized state toggled to ${isMinimized}`);
  },
  
  toggleChat: () => {
    const isOpen = !get().isOpen;
    set({ isOpen }, false, { 
      type: 'chat/toggleChat',
      isOpen
    });
    logger.info(`Chat open state toggled to ${isOpen}`);
  },
  
  closeChat: () => {
    set({ isOpen: false }, false, { type: 'chat/closeChat' });
    logger.info('Chat closed');
  },
  
  openChat: () => {
    set({ isOpen: true }, false, { type: 'chat/openChat' });
    logger.info('Chat opened');
  },
  
  toggleSidebar: () => {
    const showSidebar = !get().showSidebar;
    set({ showSidebar }, false, { 
      type: 'chat/toggleSidebar',
      showSidebar
    });
    logger.info(`Chat sidebar toggled to ${showSidebar}`);
  },
  
  setSessionLoading: (loading: boolean) => {
    set(state => ({
      ui: {
        ...state.ui,
        sessionLoading: loading
      }
    }), false, { type: 'chat/setSessionLoading', loading });
    logger.info(`Session loading state set to ${loading}`);
  },
  
  setMessageLoading: (loading: boolean) => {
    set(state => ({
      ui: {
        ...state.ui,
        messageLoading: loading
      }
    }), false, { type: 'chat/setMessageLoading', loading });
    logger.info(`Message loading state set to ${loading}`);
  },
  
  setProviderLoading: (loading: boolean) => {
    set(state => ({
      ui: {
        ...state.ui,
        providerLoading: loading
      }
    }), false, { type: 'chat/setProviderLoading', loading });
    logger.info(`Provider loading state set to ${loading}`);
  },
  
  setWaitingForResponse: (waiting: boolean) => {
    set({ isWaitingForResponse: waiting }, false, { 
      type: 'chat/setWaitingForResponse', 
      waiting 
    });
    logger.info(`Waiting for response state set to ${waiting}`);
  }
});
