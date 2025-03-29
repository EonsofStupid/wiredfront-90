
import { ChatState } from '../types/chat-store-types';
import { logger } from '@/services/chat/LoggingService';

type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean
) => void;

type GetState<T> = () => T;

/**
 * Create UI state actions for the chat store
 */
export const createUIActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => {
  return {
    /**
     * Toggle the chat visibility
     */
    toggleChat: () => {
      const isOpen = get().isOpen;
      set({ isOpen: !isOpen });
      logger.info('Chat visibility toggled', { isOpen: !isOpen });
    },
    
    /**
     * Toggle the minimized state
     */
    toggleMinimize: () => {
      const isMinimized = get().isMinimized;
      set({ isMinimized: !isMinimized });
      logger.info('Minimized state toggled', { isMinimized: !isMinimized });
    },
    
    /**
     * Toggle the sidebar visibility
     */
    toggleSidebar: () => {
      const showSidebar = get().showSidebar;
      set({ showSidebar: !showSidebar });
      logger.info('Sidebar visibility toggled', { showSidebar: !showSidebar });
    },
    
    /**
     * Reset the user input
     */
    resetInput: () => {
      set({ userInput: '' });
      logger.info('User input reset');
    },
    
    /**
     * Set an error message
     */
    setError: (error: string | null) => {
      set({ error });
      if (error) {
        logger.error('Chat error set', { error });
      } else {
        logger.info('Chat error cleared');
      }
    },
    
    /**
     * Set the current session
     */
    setCurrentSession: (sessionId: string | null) => {
      set({ currentSession: sessionId });
      logger.info('Current session set', { sessionId });
    },
    
    /**
     * Set session loading state
     */
    setSessionLoading: (isLoading: boolean) => {
      set((state) => ({
        ui: {
          ...state.ui,
          sessionLoading: isLoading
        }
      }));
      logger.info('Session loading state set', { isLoading });
    },
    
    /**
     * Set message loading state
     */
    setMessageLoading: (isLoading: boolean) => {
      set((state) => ({
        ui: {
          ...state.ui,
          messageLoading: isLoading
        }
      }));
      logger.info('Message loading state set', { isLoading });
    },
    
    /**
     * Set provider loading state
     */
    setProviderLoading: (isLoading: boolean) => {
      set((state) => ({
        ui: {
          ...state.ui,
          providerLoading: isLoading
        }
      }));
      logger.info('Provider loading state set', { isLoading });
    }
  };
};

export type UIActions = ReturnType<typeof createUIActions>;
