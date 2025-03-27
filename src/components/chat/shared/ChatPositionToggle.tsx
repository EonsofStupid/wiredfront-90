
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlignLeft, AlignRight } from "lucide-react";
import { useChatStore } from "../store/chatStore";
import { ChatPosition } from "@/types/chat/enums";
import { logger } from '@/services/chat/LoggingService';
import { useChatBridge } from '../chatBridge';

export function ChatPositionToggle() {
  const { position } = useChatStore();
  const chatBridge = useChatBridge();
  
  const togglePosition = () => {
    // Ensure we're dealing with a string position
    const currentPosition = typeof position === 'string' 
      ? position as ChatPosition 
      : 'bottom-right' as ChatPosition;
    
    const newPosition: ChatPosition = 
      currentPosition === 'bottom-right' ? 'bottom-left' : 'bottom-right';
    
    logger.info('Toggling chat position', { from: currentPosition, to: newPosition });
    chatBridge.setPosition(newPosition);
  };
  
  // Get the current position for display
  const currentPosition = typeof position === 'string'
    ? position as ChatPosition 
    : 'bottom-right' as ChatPosition;
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 hover:bg-white/10 transition-colors duration-200"
      onClick={togglePosition}
      title={currentPosition === 'bottom-right' ? "Move to left side" : "Move to right side"}
      data-testid="position-toggle"
    >
      {currentPosition === 'bottom-right' ? (
        <AlignLeft className="h-4 w-4" />
      ) : (
        <AlignRight className="h-4 w-4" />
      )}
    </Button>
  );
}
