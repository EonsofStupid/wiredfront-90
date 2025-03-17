
import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '../store/chatStore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function ChatPositionToggle() {
  const { position, togglePosition } = useChatStore();
  
  const currentPosition = typeof position === 'string' 
    ? position 
    : 'custom';
  
  const positionText = currentPosition === 'bottom-right' 
    ? 'Move to left' 
    : currentPosition === 'bottom-left' 
      ? 'Move to right' 
      : 'Toggle position';
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="chat-control-button h-8 w-8 hover:text-indigo-400 hover:bg-indigo-400/10"
            onClick={togglePosition}
            aria-label={positionText}
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{positionText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
