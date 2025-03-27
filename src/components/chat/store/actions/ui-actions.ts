
import { StateCreator } from 'zustand';
import { ChatState } from '../types/chat-store-types';
import { logger } from '@/services/chat/LoggingService';

export const createUIActions = (
  set: StateCreator<ChatState>['setState'],
  get: () => ChatState
) => ({
  /**
   * Toggle chat visibility
   */
  toggleChat: () => {
    logger.info('Toggling chat visibility', { current: get().isOpen });
    set({ isOpen: !get().isOpen }, false, { type: 'ui/toggleChat' });
  },
  
  /**
   * Toggle chat minimization
   */
  toggleMinimize: () => {
    const newState = !get().isMinimized;
    logger.info('Toggling chat minimization', { newState });
    set({ isMinimized: newState }, false, { type: 'ui/toggleMinimize' });
  },
  
  /**
   * Toggle sidebar visibility
   */
  toggleSidebar: () => {
    logger.info('Toggling sidebar visibility', { current: get().showSidebar });
    set({ showSidebar: !get().showSidebar }, false, { type: 'ui/toggleSidebar' });
  },
  
  /**
   * Set chat scale
   */
  setScale: (scale: number) => {
    logger.info('Setting chat scale', { scale });
    
    // Ensure scale is between 0.5 and 1.5
    const validScale = Math.min(Math.max(scale, 0.5), 1.5);
    
    set({ scale: validScale }, false, { type: 'ui/setScale', scale: validScale });
  },
  
  /**
   * Set session loading state
   */
  setSessionLoading: (loading: boolean) => {
    set({ 
      ui: {
        ...get().ui,
        sessionLoading: loading
      } 
    }, false, { type: 'ui/setSessionLoading', loading });
  },
  
  /**
   * Set message loading state
   */
  setMessageLoading: (loading: boolean) => {
    set({ 
      ui: {
        ...get().ui,
        messageLoading: loading
      } 
    }, false, { type: 'ui/setMessageLoading', loading });
  },
  
  /**
   * Set provider loading state
   */
  setProviderLoading: (loading: boolean) => {
    set({ 
      ui: {
        ...get().ui,
        providerLoading: loading
      } 
    }, false, { type: 'ui/setProviderLoading', loading });
  },
  
  /**
   * Set docked state
   */
  setDocked: (docked: boolean) => {
    logger.info('Setting docked state', { docked });
    set({ docked }, false, { type: 'ui/setDocked', docked });
  },
  
  /**
   * Toggle docked state
   */
  toggleDocked: () => {
    const newState = !get().docked;
    logger.info('Toggling docked state', { newState });
    set({ docked: newState }, false, { type: 'ui/toggleDocked' });
  }
});
