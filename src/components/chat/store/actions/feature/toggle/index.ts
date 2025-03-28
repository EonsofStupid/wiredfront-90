
import { ChatState } from '../../../types/chat-store-types';
import { FeatureActions, SetState, GetState } from '../types';
import { createFeatureToggleActions } from './feature-toggle-actions';
import { createProviderActions } from './provider-actions';
import { ChatPositionType } from '@/types/chat/enums';
import { logger } from '@/services/chat/LoggingService';

/**
 * Creates all toggle-related actions for the chat store
 */
export const createToggleActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
): Pick<FeatureActions, 'toggleFeature' | 'enableFeature' | 'disableFeature' | 'setFeatureState' | 'togglePosition' | 'updateProviders' | 'updateChatProvider'> => {
  return {
    ...createFeatureToggleActions(set, get),
    ...createProviderActions(set, get),
    
    /**
     * Toggle position between bottom-left and bottom-right
     */
    togglePosition: () => {
      const currentPosition = get().position;
      // Default to bottom-right if the position is not a string or not a valid position
      const newPosition: ChatPositionType = 
        currentPosition === 'bottom-right' ? 'bottom-left' : 'bottom-right';
      
      logger.info('Toggling chat position', { 
        from: currentPosition, 
        to: newPosition 
      });
      
      set({ position: newPosition }, false, 'chat/togglePosition');
    }
  };
};

/**
 * Utility function to create positions toggle actions
 * Will be moved to its own file in future refactoring
 */
export const createPositionActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => ({
  togglePosition: () => {
    const currentPosition = get().position;
    const newPosition: ChatPositionType = 
      currentPosition === 'bottom-right' ? 'bottom-left' : 'bottom-right';
    
    logger.info('Toggling chat position', { 
      from: currentPosition, 
      to: newPosition 
    });
    
    set({ position: newPosition }, false, 'chat/togglePosition');
  },
  
  setPosition: (position: ChatPositionType) => {
    logger.info('Setting chat position', { position });
    
    set({ position }, false, 'chat/setPosition');
  }
});
