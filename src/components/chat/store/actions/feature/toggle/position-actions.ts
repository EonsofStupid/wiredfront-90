
import { ChatState } from '../../../types/chat-store-types';
import { SetState, GetState } from '../types';
import { ChatPositionType } from '@/types/chat/enums';
import { logger } from '@/services/chat/LoggingService';

/**
 * Creates position-related toggle actions for the chat store
 */
export const createPositionActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => ({
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
    
    set({ position: newPosition }, false, { type: 'chat/togglePosition' });
  },
  
  /**
   * Set position to a specific value
   */
  setPosition: (position: ChatPositionType) => {
    logger.info('Setting chat position', { position });
    
    set({ position }, false, { type: 'chat/setPosition' });
  }
});
