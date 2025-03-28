
import { ChatState } from '../../../types/chat-store-types';
import { SetState, GetState } from '../types';
import { logger } from '@/services/chat/LoggingService';
import { ChatPosition } from '@/types/chat/enums';
import { 
  isChatPosition, 
  isChatPositionCoordinates, 
  ChatPositionUnion, 
  ChatPositionCoordinates 
} from '@/components/chat/types/chat-modes';

/**
 * Creates position-related actions for the chat store
 */
export const createPositionActions = (
  set: (state: Partial<ChatState> | ((state: ChatState) => Partial<ChatState>), replace?: boolean, action?: any) => void,
  get: () => ChatState
) => ({
  /**
   * Toggle between bottom-right and bottom-left positions
   */
  togglePosition: () => {
    const currentPosition = get().position;
    let newPosition: string;
    
    if (typeof currentPosition === 'string') {
      newPosition = currentPosition === ChatPosition.BottomRight ? 
        ChatPosition.BottomLeft : 
        ChatPosition.BottomRight;
    } else {
      // If current position is custom, default to bottom-right
      newPosition = ChatPosition.BottomRight;
    }
    
    logger.info('Toggling chat position', { from: currentPosition, to: newPosition });
    
    set({ position: newPosition }, false, { type: 'chat/togglePosition' });
  },
  
  /**
   * Set the chat position directly
   */
  setPosition: (position: ChatPositionUnion) => {
    const currentPosition = get().position;
    logger.info('Setting chat position', { from: currentPosition, to: position });
    
    // Validate position
    if (isChatPosition(position) || isChatPositionCoordinates(position)) {
      set({ position: position as any }, false, { type: 'chat/setPosition' });
    } else {
      logger.error('Invalid chat position', { position });
    }
  }
});
