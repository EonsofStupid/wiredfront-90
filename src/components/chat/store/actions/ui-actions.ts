
import { StateCreator } from 'zustand';
import { ChatState } from '../types/chat-store-types';
import { logger } from '@/services/chat/LoggingService';

type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean,
  action?: { type: string; [key: string]: any }
) => void;

export const createUIActions = <T extends ChatState>(
  set: SetState<T>,
  get: () => T
) => ({
  toggleMinimize: () => {
    const isMinimized = !get().isMinimized;
    set({ isMinimized } as Partial<T>, false, { 
      type: 'chat/toggleMinimize',
      isMinimized
    });
    logger.info(`Chat minimized state toggled to ${isMinimized}`);
  },
  
  toggleChat: () => {
    const isOpen = !get().isOpen;
    set({ isOpen } as Partial<T>, false, { 
      type: 'chat/toggleChat',
      isOpen
    });
    logger.info(`Chat open state toggled to ${isOpen}`);
  },
  
  closeChat: () => {
    set({ isOpen: false } as Partial<T>, false, { type: 'chat/closeChat' });
    logger.info('Chat closed');
  },
  
  openChat: () => {
    set({ isOpen: true } as Partial<T>, false, { type: 'chat/openChat' });
    logger.info('Chat opened');
  },
  
  toggleSidebar: () => {
    const showSidebar = !get().showSidebar;
    set({ showSidebar } as Partial<T>, false, { 
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
    }) as Partial<T>, false, { type: 'chat/setSessionLoading', loading });
    logger.info(`Session loading state set to ${loading}`);
  },
  
  setMessageLoading: (loading: boolean) => {
    set(state => ({
      ui: {
        ...state.ui,
        messageLoading: loading
      }
    }) as Partial<T>, false, { type: 'chat/setMessageLoading', loading });
    logger.info(`Message loading state set to ${loading}`);
  },
  
  setProviderLoading: (loading: boolean) => {
    set(state => ({
      ui: {
        ...state.ui,
        providerLoading: loading
      }
    }) as Partial<T>, false, { type: 'chat/setProviderLoading', loading });
    logger.info(`Provider loading state set to ${loading}`);
  },
  
  setWaitingForResponse: (waiting: boolean) => {
    set({ isWaitingForResponse: waiting } as Partial<T>, false, { 
      type: 'chat/setWaitingForResponse', 
      waiting 
    });
    logger.info(`Waiting for response state set to ${waiting}`);
  }
});
