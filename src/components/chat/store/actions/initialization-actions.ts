
import { StateCreator } from 'zustand';
import { ChatState } from '../types/chat-store-types';
import { logger } from '@/services/chat/LoggingService';

export const createInitializationActions = (
  set: StateCreator<ChatState>['setState'],
  get: () => ChatState
) => ({
  initializeChat: () => {
    logger.info('Initializing chat state');
    
    // Set default chat state
    set({
      initialized: true,
      isOpen: false,
      isHidden: false,
      docked: true,
      position: 'bottom-right',
      isMinimized: false,
      showSidebar: true,
      scale: 1,
      startTime: Date.now(),
    }, false, 'chat/initialize');
    
    // We could load saved state here from localStorage if needed
    
    // Initialize feature flags
    set({
      features: {
        voice: true,
        rag: true,
        modeSwitch: true,
        notifications: true,
        github: true,
        codeAssistant: true,
        ragSupport: true,
        githubSync: true,
        tokenEnforcement: false,
      }
    }, false, 'chat/initializeFeatures');
    
    logger.info('Chat initialized');
  },
});
