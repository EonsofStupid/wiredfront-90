
import React from 'react';
import { ArrowLeftRight } from "lucide-react";
import { useChatStore } from '../store/chatStore';
import { logger } from '@/services/chat/LoggingService';
import { ChatPosition } from '../store/types/chat-store-types';

export function ChatPositionToggle() {
  const { togglePosition, position } = useChatStore();
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    logger.info('Position toggled', { from: position });
    togglePosition();
  };
  
  // Get a display string for the position
  const getPositionDisplay = (): string => {
    if (typeof position === 'string') {
      return position;
    }
    return `Custom (${position.x}, ${position.y})`;
  };
  
  return (
    <button
      className="h-8 w-8 hover:bg-white/10 text-chat-text transition-colors duration-200"
      onClick={handleClick}
      title={`Toggle chat position (currently ${getPositionDisplay()})`}
      data-testid="chat-position-toggle"
    >
      <ArrowLeftRight className="h-4 w-4" />
    </button>
  );
}
