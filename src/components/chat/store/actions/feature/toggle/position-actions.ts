
import { ChatState } from '../../../types/chat-store-types';
import { ChatPosition } from '@/components/chat/types/chat/enums';
import { SetState, GetState } from '../types';
import { logger } from '@/services/chat/LoggingService';

/**
 * Creates position-related actions for the chat store
 */
export const createPositionActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => {
  return {
    /**
     * Toggle the chat position between bottom-right and bottom-left
     */
    togglePosition: () => {
      const { position } = get();
      const newPosition = position === ChatPosition.BottomRight 
        ? ChatPosition.BottomLeft 
        : ChatPosition.BottomRight;
      
      logger.info(`Toggling chat position to: ${newPosition}`);
      
      set({ position: newPosition });
    },
    
    /**
     * Set the chat position directly
     */
    setPosition: (position: ChatPosition) => {
      logger.info(`Setting chat position to: ${position}`);
      
      set({ position });
    }
  };
};
