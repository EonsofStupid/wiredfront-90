
import { StateCreator } from 'zustand';
import { logger } from '@/services/chat/LoggingService';
import { ChatState } from '../types/chat-store-types';

export interface InitializationActions {
  initializeChatSettings: () => void;
}

export const createInitializationActions: StateCreator<
  ChatState,
  [],
  [],
  InitializationActions
> = (set, get, api) => ({
  initializeChatSettings: () => {
    const state = get();
    if (state.initialized) return;
    
    // Set default position based on screen size
    const isMobile = window.innerWidth < 768;
    const defaultPosition = isMobile ? 'bottom-right' : 'bottom-right';
    
    // Set default scale based on screen size
    const defaultScale = isMobile ? 0.85 : 1;
    
    // Set default docked state based on screen size
    const defaultDocked = isMobile ? true : true;
    
    logger.info('Initializing chat settings', {
      isMobile,
      defaultPosition,
      defaultScale,
      defaultDocked
    });
    
    set({
      position: defaultPosition,
      scale: defaultScale,
      docked: defaultDocked,
      initialized: true
    });
  }
});
