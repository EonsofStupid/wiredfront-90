
import React from 'react';
import { AlignLeft, AlignRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '../store/chatStore';
import { ChatPosition } from '../types';

export const ChatPositionToggle = () => {
  const { position, togglePosition } = useChatStore();
  
  const currentPosition = position as ChatPosition;
  const isLeft = currentPosition === 'bottom-left';
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 hover:bg-white/10 transition-colors duration-200"
      onClick={togglePosition}
      title={isLeft ? "Move to right" : "Move to left"}
      data-testid="position-toggle-button"
    >
      {isLeft ? (
        <AlignRight className="h-4 w-4" />
      ) : (
        <AlignLeft className="h-4 w-4" />
      )}
    </Button>
  );
};
