
import { ChatState } from '../types/chat-store-types';
import { logger } from '@/services/chat/LoggingService';

type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean
) => void;

type GetState<T> = () => T;

/**
 * Create UI-related actions for the chat store
 */
export const createUIActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => {
  return {
    /**
     * Toggle the chat panel open/closed
     */
    toggleChat: () => {
      const isCurrentlyOpen = get().isOpen;
      set({ isOpen: !isCurrentlyOpen });
      logger.info('Chat toggled', { isOpen: !isCurrentlyOpen });
    },
    
    /**
     * Toggle the minimized state of the chat
     */
    toggleMinimize: () => {
      const isCurrentlyMinimized = get().isMinimized;
      set({ isMinimized: !isCurrentlyMinimized });
      logger.info('Chat minimized state toggled', { isMinimized: !isCurrentlyMinimized });
    },
    
    /**
     * Toggle the sidebar visibility
     */
    toggleSidebar: () => {
      const isCurrentlySidebarShown = get().showSidebar;
      set({ showSidebar: !isCurrentlySidebarShown });
      logger.info('Sidebar toggled', { showSidebar: !isCurrentlySidebarShown });
    },
    
    /**
     * Reset the user input field
     */
    resetInput: () => {
      set({ userInput: '' });
      logger.info('User input reset');
    },
    
    /**
     * Set the error state
     */
    setError: (error: Error | null) => {
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
    setCurrentSession: (session: any) => {
      set({ currentSession: session });
      logger.info('Current session set', { sessionId: session?.id });
    },
    
    /**
     * Set loading states
     */
    setSessionLoading: (isLoading: boolean) => {
      set(state => ({
        ui: {
          ...state.ui,
          sessionLoading: isLoading
        }
      }));
      logger.debug('Session loading state set', { isLoading });
    },
    
    setMessageLoading: (isLoading: boolean) => {
      set(state => ({
        ui: {
          ...state.ui,
          messageLoading: isLoading
        }
      }));
      logger.debug('Message loading state set', { isLoading });
    },
    
    setProviderLoading: (isLoading: boolean) => {
      set(state => ({
        ui: {
          ...state.ui,
          providerLoading: isLoading
        }
      }));
      logger.debug('Provider loading state set', { isLoading });
    }
  };
};
