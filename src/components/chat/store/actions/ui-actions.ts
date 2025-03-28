
import { ChatState } from '../../types';
import { logger } from '@/services/chat/LoggingService';

/**
 * Create UI actions for the chat store
 */
export const createUIActions = (
  set: (partial: Partial<ChatState> | ((state: ChatState) => Partial<ChatState>), replace?: boolean, name?: string | {type: string}) => void,
  get: () => ChatState
) => {
  return {
    /**
     * Toggle chat open/closed
     */
    toggleChat: () => {
      const isOpen = get().isOpen;
      logger.info(`Toggling chat ${isOpen ? 'closed' : 'open'}`);
      
      set({
        isOpen: !isOpen,
        // If opening, ensure it's not minimized
        ...(isOpen ? {} : { isMinimized: false })
      }, false, { type: 'chat/toggleChat' });
    },
    
    /**
     * Toggle chat minimized state
     */
    toggleMinimize: () => {
      const isMinimized = get().isMinimized;
      logger.info(`Toggling chat ${isMinimized ? 'maximized' : 'minimized'}`);
      
      set({
        isMinimized: !isMinimized
      }, false, { type: 'chat/toggleMinimize' });
    },
    
    /**
     * Toggle chat sidebar visibility
     */
    toggleSidebar: () => {
      const showSidebar = get().showSidebar;
      logger.info(`Toggling sidebar ${showSidebar ? 'hidden' : 'visible'}`);
      
      set({
        showSidebar: !showSidebar
      }, false, { type: 'chat/toggleSidebar' });
    },
    
    /**
     * Toggle docked state
     */
    toggleDocked: () => {
      const docked = get().docked;
      logger.info(`Toggling chat ${docked ? 'undocked' : 'docked'}`);
      
      set({
        docked: !docked
      }, false, { type: 'chat/toggleDocked' });
    },
    
    /**
     * Set chat ID
     */
    setChatId: (id: string | null) => {
      logger.info('Setting chat ID', { id });
      
      set({
        chatId: id
      }, false, { type: 'chat/setChatId' });
    },
    
    /**
     * Set UI loading states
     */
    setSessionLoading: (isLoading: boolean) => {
      set(state => ({
        ui: {
          ...state.ui,
          sessionLoading: isLoading
        }
      }), false, { type: 'chat/setSessionLoading', isLoading });
    },
    
    setMessageLoading: (isLoading: boolean) => {
      set(state => ({
        ui: {
          ...state.ui,
          messageLoading: isLoading
        }
      }), false, { type: 'chat/setMessageLoading', isLoading });
    },
    
    setProviderLoading: (isLoading: boolean) => {
      set(state => ({
        ui: {
          ...state.ui,
          providerLoading: isLoading
        }
      }), false, { type: 'chat/setProviderLoading', isLoading });
    }
  };
};
