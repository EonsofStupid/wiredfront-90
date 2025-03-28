import { ChatState } from '../../../types/chat-store-types';
import { SetState, GetState } from '../types';
import { logger } from '@/services/chat/LoggingService';
import { ChatPosition } from '@/types/chat/enums';

/**
 * Creates position toggle actions for the chat store
 */
export const createPositionActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => ({
  /**
   * Toggle between bottom-right and bottom-left positions
   */
  togglePosition: () => {
    const { position } = get();
    
    // If we have a custom position, just go to bottom-right
    if (typeof position !== 'string') {
      logger.info('Toggling position from custom to bottom-right');
      set({ position: ChatPosition.BottomRight }, false, { type: 'position/toggle' });
      return;
    }
    
    // Otherwise toggle between the fixed positions
    const newPosition = position === ChatPosition.BottomRight 
      ? ChatPosition.BottomLeft 
      : ChatPosition.BottomRight;
    
    logger.info(`Toggling position from ${position} to ${newPosition}`);
    
    set({ position: newPosition }, false, { type: 'position/toggle' });
  },
  
  /**
   * Set the position directly
   */
  setPosition: (newPosition: string | { x: number, y: number }) => {
    const { position } = get();
    
    // Don't update if the same position
    if (JSON.stringify(position) === JSON.stringify(newPosition)) {
      return;
    }
    
    logger.info('Setting chat position', { 
      oldPosition: position, 
      newPosition 
    });
    
    set({ position: newPosition }, false, { type: 'position/set', position: newPosition });
  }
});
