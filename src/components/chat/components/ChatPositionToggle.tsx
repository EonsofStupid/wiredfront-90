
import React from 'react';
import { ArrowLeftRight } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useChatStore } from '../store/chatStore';
import { logger } from '@/services/chat/LoggingService';

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
    <Button
      variant="ghost"
      size="icon"
      className="chat-control-button h-8 w-8"
      onClick={handleClick}
      title={`Toggle chat position (currently ${getPositionDisplay()})`}
      data-testid="chat-position-toggle"
    >
      <ArrowLeftRight className="h-4 w-4" />
    </Button>
  );
}
