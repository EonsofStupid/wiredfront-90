import { StateCreator } from 'zustand';
import { ChatState } from '../types/chat-store-types';
import { createToggleActions } from './feature/toggle';
import { ChatMode } from '@/components/chat/types/chat/enums';
import { logger } from '@/services/chat/LoggingService';

export const createFeatureActions = (
  set: StateCreator<ChatState>['setState'],
  get: () => ChatState,
  api: any
) => {
  // Get toggle-specific actions
  const toggleActions = createToggleActions(set, get);
  
  return {
    // Feature toggle actions
    toggleFeature: toggleActions.toggleFeature,
    enableFeature: toggleActions.enableFeature,
    disableFeature: toggleActions.disableFeature,
    setFeatureState: toggleActions.setFeatureState,
    
    // Position actions
    togglePosition: toggleActions.togglePosition,
    setPosition: toggleActions.setPosition,
    
    // Provider actions
    updateChatProvider: toggleActions.updateChatProvider,
    
    // Mode actions
    setMode: (mode: string | ChatMode) => {
      logger.info('Setting chat mode', { mode });
      
      // Ensure we're setting a valid chat mode
      const validMode = typeof mode === 'string' ? mode as ChatMode : mode;
      
      set({
        currentMode: validMode
      });
    },
    
    // Model actions
    setModel: (model: string) => {
      logger.info('Selected model set', { model });
      
      set({
        selectedModel: model
      });
    }
  };
};
