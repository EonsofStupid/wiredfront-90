
import React from 'react';
import { ArrowLeftRight } from "lucide-react";
import { useChatStore } from '../store/chatStore';
import { logger } from '@/services/chat/LoggingService';
import { 
  ChatPosition, 
  ChatPositionType, 
  isChatPosition, 
  isChatPositionCoordinates 
} from '@/types/chat/enums';

export function ChatPositionToggle() {
  const { position, togglePosition } = useChatStore();
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    logger.info('Toggling chat position', { currentPosition: position });
    togglePosition();
  };
  
  // Get a display string for the position
  const getPositionDisplay = (): string => {
    if (isChatPosition(position)) {
      return position;
    }
    // Check if position has coordinates
    if (isChatPositionCoordinates(position)) {
      return `Custom (${position.x}, ${position.y})`;
    }
    return 'Unknown';
  };
  
  return (
    <button
      className="h-8 w-8 hover:bg-white/10 text-chat-text transition-colors duration-200"
      onClick={handleClick}
      title={`Toggle chat position (currently ${getPositionDisplay()})`}
      data-testid="chat-position-toggle"
      aria-label="Toggle chat position"
    >
      <ArrowLeftRight className="h-4 w-4" />
    </button>
  );
}
