
import { StateCreator } from 'zustand';
import { ChatState } from '../../types/chat-store-types';
import { logger } from '@/services/chat/LoggingService';
import { ChatMode, ChatPositionType } from '@/types/chat/enums';
import { createToggleActions } from './toggle';

// Re-export the feature key type from the types file
export type { FeatureKey } from './types';

/**
 * Create feature actions for the chat store
 */
export const createFeatureActions = (
  set: (partial: Partial<ChatState> | ((state: ChatState) => Partial<ChatState>), replace?: boolean, name?: string | {type: string}) => void,
  get: () => ChatState,
  api: any
) => {
  // Get toggle-specific actions
  const toggleActions = createToggleActions(set, get);
  
  return {
    /**
     * Toggle a feature on/off
     */
    toggleFeature: toggleActions.toggleFeature,
    
    /**
     * Set a feature to a specific state
     */
    setFeatureState: toggleActions.setFeatureState,
    
    /**
     * Enable a feature
     */
    enableFeature: toggleActions.enableFeature,
    
    /**
     * Disable a feature
     */
    disableFeature: toggleActions.disableFeature,
    
    /**
     * Update chat providers
     */
    updateProviders: toggleActions.updateProviders,
    
    /**
     * Update chat provider
     */
    updateChatProvider: toggleActions.updateChatProvider,
    
    /**
     * Toggle position between bottom-left and bottom-right
     */
    togglePosition: toggleActions.togglePosition,
    
    /**
     * Set the selected model
     */
    setModel: (model: string) => {
      logger.info('Setting selected model', { model });
      
      set({
        selectedModel: model
      }, false, { type: 'chat/setModel' });
    },
    
    /**
     * Set the selected mode
     */
    setMode: (mode: string | ChatMode) => {
      logger.info('Setting selected mode', { mode });
      
      // Ensure we're setting a valid chat mode
      const validMode = typeof mode === 'string' ? mode as ChatMode : mode;
      
      set({
        currentMode: validMode
      }, false, { type: 'chat/setMode' });
    },
    
    /**
     * Set the chat position
     */
    setPosition: (position: ChatPositionType) => {
      logger.info('Setting chat position', { position });
      
      set({
        position
      }, false, { type: 'chat/setPosition' });
    }
  };
};
