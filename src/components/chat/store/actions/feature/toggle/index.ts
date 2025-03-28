
import { ChatState } from '../../../types/chat-store-types';
import { FeatureActions, SetState, GetState } from '../types';
import { createFeatureToggleActions } from './feature-toggle-actions';
import { createProviderActions } from './provider-actions';
import { ChatPositionType } from '@/types/chat/enums';

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
      
      set({ position: newPosition }, false, 'chat/togglePosition');
    }
  };
};
