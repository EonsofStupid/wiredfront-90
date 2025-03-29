
import { ChatState } from '../../../types/chat-store-types';
import { SetState, GetState } from '../types';
import { ChatPosition } from '@/types/chat/enums';
import { logger } from '@/services/chat/LoggingService';

/**
 * Creates UI position-related actions for the chat store
 */
export const createPositionActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => {
  return {
    /**
     * Toggle the chat position between left and right
     */
    togglePosition: () => {
      const currentPosition = get().position;
      
      const newPosition = currentPosition === ChatPosition.BottomRight 
        ? ChatPosition.BottomLeft 
        : ChatPosition.BottomRight;
      
      logger.debug('Toggling chat position', { from: currentPosition, to: newPosition });
      
      set({ position: newPosition });
      
      // Save the position preference to local storage
      try {
        localStorage.setItem('chat-position', newPosition);
      } catch (e) {
        logger.error('Failed to save position preference', e);
      }
    },
    
    /**
     * Set the chat position explicitly
     */
    setPosition: (position: ChatPosition) => {
      logger.debug('Setting chat position', { position });
      set({ position });
      
      // Save the position preference to local storage
      try {
        localStorage.setItem('chat-position', position);
      } catch (e) {
        logger.error('Failed to save position preference', e);
      }
    }
  };
};
