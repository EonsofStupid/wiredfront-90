
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";
import { useChatStore } from '../store/chatStore';
import { logger } from '@/services/chat/LoggingService';

export function ChatPositionToggle() {
  const { togglePosition, position } = useChatStore();
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    logger.info('Position toggled', { from: position });
    togglePosition();
  };
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 hover:bg-white/10 transition-colors duration-200"
      onClick={handleClick}
      title={`Toggle chat position (currently ${position})`}
      data-testid="chat-position-toggle"
    >
      <ArrowLeftRight className="h-4 w-4" />
    </Button>
  );
}
