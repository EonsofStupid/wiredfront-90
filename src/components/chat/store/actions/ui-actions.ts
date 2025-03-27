
import { StateCreator } from 'zustand';
import { ChatState, ChatPosition } from '../types/chat-store-types';
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
    }, false, { type: 'ui/setSessionLoading', isLoading });
  },
  
  setMessageLoading: (isLoading: boolean) => {
    set({
      ui: {
        ...get().ui,
        messageLoading: isLoading
      }
    }, false, { type: 'ui/setMessageLoading', isLoading });
  },
  
  setProviderLoading: (isLoading: boolean) => {
    set({
      ui: {
        ...get().ui,
        providerLoading: isLoading
      }
    }, false, { type: 'ui/setProviderLoading', isLoading });
  },
  
  toggleChat: () => {
    const isOpen = get().isOpen;
    
    logger.info(`Toggling chat visibility`, { newState: !isOpen });
    
    set({
      isOpen: !isOpen
    }, false, { type: 'ui/toggleChat', isOpen: !isOpen });
  },
  
  toggleMinimize: () => {
    const isMinimized = get().isMinimized;
    
    logger.info(`Toggling chat minimize state`, { newState: !isMinimized });
    
    set({
      isMinimized: !isMinimized
    }, false, { type: 'ui/toggleMinimize', isMinimized: !isMinimized });
  },
  
  toggleSidebar: () => {
    const showSidebar = get().showSidebar;
    
    logger.info(`Toggling sidebar visibility`, { newState: !showSidebar });
    
    set({
      showSidebar: !showSidebar
    }, false, { type: 'ui/toggleSidebar', showSidebar: !showSidebar });
  },
  
  toggleDocked: () => {
    const docked = get().docked;
    
    logger.info(`Toggling chat docked state`, { newState: !docked });
    
    set({
      docked: !docked
    }, false, { type: 'ui/toggleDocked', docked: !docked });
  },
  
  setPosition: (position: ChatPosition) => {
    logger.info(`Setting chat position`, { position });
    
    set({
      position
    }, false, { type: 'ui/setPosition', position });
  },
  
  togglePosition: () => {
    const currentPosition = get().position;
    const newPosition: ChatPosition = currentPosition === 'bottom-right' ? 'bottom-left' : 'bottom-right';
    
    logger.info(`Toggling chat position`, { from: currentPosition, to: newPosition });
    
    set({
      position: newPosition
    }, false, { type: 'ui/togglePosition', from: currentPosition, to: newPosition });
  },
  
  setScale: (scale: number) => {
    // Ensure scale is within reasonable bounds
    const validScale = Math.max(0.5, Math.min(scale, 1.5));
    
    logger.info(`Setting chat scale`, { scale: validScale });
    
    set({
      scale: validScale
    }, false, { type: 'ui/setScale', scale: validScale });
  },
  
  openChat: () => {
    if (!get().isOpen) {
      logger.info('Opening chat');
      set({ isOpen: true }, false, { type: 'ui/openChat' });
    }
    
    if (get().isMinimized) {
      logger.info('Maximizing chat');
      set({ isMinimized: false }, false, { type: 'ui/maximizeChat' });
    }
  },
  
  closeChat: () => {
    if (get().isOpen) {
      logger.info('Closing chat');
      set({ isOpen: false }, false, { type: 'ui/closeChat' });
    }
  },
  
  minimizeChat: () => {
    if (!get().isMinimized) {
      logger.info('Minimizing chat');
      set({ isMinimized: true }, false, { type: 'ui/minimizeChat' });
    }
  },
  
  maximizeChat: () => {
    if (get().isMinimized) {
      logger.info('Maximizing chat');
      set({ isMinimized: false }, false, { type: 'ui/maximizeChat' });
    }
  }
});
