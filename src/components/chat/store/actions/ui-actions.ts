
import { StateCreator } from 'zustand';
import { ChatState } from '../types/chat-store-types';
import { logger } from '@/services/chat/LoggingService';

export const createUIActions = (
  set: StateCreator<ChatState>['setState'],
  get: () => ChatState
) => ({
  setSessionLoading: (isLoading: boolean) => {
    set({
      ui: {
        ...get().ui,
        sessionLoading: isLoading
      }
    }, false, 'chat/setSessionLoading');
  },
  
  setMessageLoading: (isLoading: boolean) => {
    set({
      ui: {
        ...get().ui,
        messageLoading: isLoading
      }
    }, false, 'chat/setMessageLoading');
  },
  
  setProviderLoading: (isLoading: boolean) => {
    set({
      ui: {
        ...get().ui,
        providerLoading: isLoading
      }
    }, false, 'chat/setProviderLoading');
  },
  
  toggleChat: () => {
    const isOpen = get().isOpen;
    
    logger.info(`Toggling chat visibility`, { newState: !isOpen });
    
    set({
      isOpen: !isOpen
    }, false, 'chat/toggleChat');
  },
  
  toggleMinimize: () => {
    const isMinimized = get().isMinimized;
    
    logger.info(`Toggling chat minimize state`, { newState: !isMinimized });
    
    set({
      isMinimized: !isMinimized
    }, false, 'chat/toggleMinimize');
  },
  
  toggleSidebar: () => {
    const showSidebar = get().showSidebar;
    
    logger.info(`Toggling sidebar visibility`, { newState: !showSidebar });
    
    set({
      showSidebar: !showSidebar
    }, false, 'chat/toggleSidebar');
  },
  
  toggleDocked: () => {
    const docked = get().docked;
    
    logger.info(`Toggling chat docked state`, { newState: !docked });
    
    set({
      docked: !docked
    }, false, 'chat/toggleDocked');
  },
  
  setPosition: (position: 'bottom-left' | 'bottom-right') => {
    logger.info(`Setting chat position`, { position });
    
    set({
      position
    }, false, 'chat/setPosition');
  },
  
  setScale: (scale: number) => {
    // Ensure scale is within reasonable bounds
    const validScale = Math.max(0.5, Math.min(scale, 1.5));
    
    logger.info(`Setting chat scale`, { scale: validScale });
    
    set({
      scale: validScale
    }, false, 'chat/setScale');
  },
});
