
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlignLeft, AlignRight } from "lucide-react";
import { useChatStore } from "../store/chatStore";
import { 
  ChatPosition, 
  ChatPositionCoordinates,
  isChatPosition,
  isChatPositionCoordinates 
} from "@/types/chat/enums";
import { logger } from '@/services/chat/LoggingService';
import { useChatBridge } from '../chatBridge';

export function ChatPositionToggle() {
  const { position } = useChatStore();
  const chatBridge = useChatBridge();
  
  const togglePosition = () => {
    // Check if position is a string type (ChatPosition)
    if (isChatPosition(position)) {
      const currentPosition = position as ChatPosition;
      const newPosition: ChatPosition = 
        currentPosition === 'bottom-right' ? 'bottom-left' : 'bottom-right';
      
      logger.info('Toggling chat position', { from: currentPosition, to: newPosition });
      chatBridge.setPosition(newPosition);
    } 
    // If it's an object with x,y coordinates
    else if (isChatPositionCoordinates(position)) {
      // Default to bottom-right if we need to convert from coordinates to position
      const newPosition: ChatPosition = 'bottom-right';
      logger.info('Switching from coordinates to fixed position', { to: newPosition });
      chatBridge.setPosition(newPosition);
    }
  };
  
  // Get the current position for display
  const currentPosition = isChatPosition(position)
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
