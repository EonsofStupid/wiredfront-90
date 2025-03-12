
import { logger } from '@/services/chat/LoggingService';
import { ChatState } from '../types/chat-store-types';

export const createUIActions = (set: Function, get: Function) => ({
  togglePosition: () => set((state: ChatState) => {
    const newPosition = state.position === 'bottom-right' ? 'bottom-left' : 'bottom-right';
    logger.info('Chat position toggled', { 
      from: state.position, 
      to: newPosition 
    });
    return { position: newPosition };
  }),
  
  toggleMinimize: () => set((state: ChatState) => {
    const newState = !state.isMinimized;
    logger.info('Chat minimized state toggled', { 
      wasMinimized: state.isMinimized,
      isNowMinimized: newState
    });
    return { isMinimized: newState };
  }),
  
  toggleSidebar: () => set((state: ChatState) => {
    const newState = !state.showSidebar;
    logger.info('Chat sidebar toggled', { 
      wasVisible: state.showSidebar,
      isNowVisible: newState
    });
    return { showSidebar: newState };
  }),
  
  toggleChat: () => set((state: ChatState) => {
    const newState = !state.isOpen;
    logger.info('Chat visibility toggled', { 
      wasOpen: state.isOpen,
      isNowOpen: newState
    });
    return { isOpen: newState };
  }),
  
  setScale: (scale: number) => set((state: ChatState) => {
    logger.info('Chat scale updated', { 
      oldScale: state.scale, 
      newScale: scale 
    });
    return { scale };
  }),
  
  toggleDocked: () => set((state: ChatState) => {
    const newState = !state.docked;
    logger.info('Chat docked state toggled', { 
      wasDocked: state.docked,
      isNowDocked: newState
    });
    return { docked: newState };
  })
});
