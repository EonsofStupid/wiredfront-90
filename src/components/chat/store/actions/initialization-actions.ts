
import { ChatState } from '../../types';
import { logger } from '@/services/chat/LoggingService';

/**
 * Create initialization actions for the chat store
 */
export const createInitializationActions = (
  set: (partial: Partial<ChatState> | ((state: ChatState) => Partial<ChatState>), replace?: boolean, name?: string | {type: string}) => void,
  get: () => ChatState
) => {
  return {
    /**
     * Initialize the chat
     */
    initializeChat: () => {
      logger.info('Initializing chat');
      
      // Restore state from localStorage if available
      const savedState = localStorage.getItem('chatState');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          
          set({
            ...parsed,
            initialized: true,
            startTime: Date.now()
          }, false, { type: 'chat/initialize' });
          
          logger.info('Chat initialized from saved state');
          return;
        } catch (error) {
          logger.error('Failed to parse saved chat state', { error });
        }
      }
      
      // Set initialized flag
      set({
        initialized: true,
        startTime: Date.now()
      }, false, { type: 'chat/initialize' });
      
      logger.info('Chat initialized with default state');
    }
  };
};
