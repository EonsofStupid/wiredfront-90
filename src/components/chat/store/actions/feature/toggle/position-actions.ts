
import { ChatState } from '../../../types/chat-store-types';
import { ChatPosition } from '@/types/chat/enums';
import { logger } from '@/services/chat/LoggingService';
import { SetState, GetState } from '../types';

/**
 * Create position-related actions for the chat store
 */
export const createPositionActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => ({
  /**
   * Toggle between bottom left and bottom right positions
   */
  togglePosition: () => {
    const currentPosition = get().position;
    let newPosition: ChatPosition;
    
    if (currentPosition === ChatPosition.BottomRight) {
      newPosition = ChatPosition.BottomLeft;
    } else {
      newPosition = ChatPosition.BottomRight;
    }
    
    set({ position: newPosition });
    logger.info('Chat position toggled', { 
      from: currentPosition, 
      to: newPosition 
    });
  },
  
  /**
   * Set a specific position
   */
  setPosition: (position: ChatPosition) => {
    set({ position });
    logger.info('Chat position set', { position });
  }
});

export type PositionActions = ReturnType<typeof createPositionActions>;
