
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { ChatPosition } from '@/components/chat/types/chat/enums';
import { cn } from '@/lib/utils';

export function ChatPositionToggle() {
  const { position, togglePosition } = useChatStore();
  
  const isRightPositioned = position === ChatPosition.BottomRight;
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-8 w-8 transition-colors duration-200",
        "hover:bg-white/10"
      )}
      onClick={togglePosition}
      title={isRightPositioned ? "Move to left side" : "Move to right side"}
      data-testid="position-toggle-button"
    >
      {isRightPositioned ? (
        <ChevronsLeft className="h-4 w-4" />
      ) : (
        <ChevronsRight className="h-4 w-4" />
      )}
    </Button>
  );
}

export default ChatPositionToggle;
