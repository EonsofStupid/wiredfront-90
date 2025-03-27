
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlignLeft, AlignRight } from "lucide-react";
import { useChatStore } from "../store/chatStore";
import { ChatPosition } from "../store/types/chat-store-types";

export function ChatPositionToggle() {
  const { position, setPosition } = useChatStore();
  
  const togglePosition = () => {
    const newPosition: ChatPosition = position === 'bottom-right' ? 'bottom-left' : 'bottom-right';
    setPosition(newPosition);
  };
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 hover:bg-white/10 transition-colors duration-200"
      onClick={togglePosition}
      title={position === 'bottom-right' ? "Move to left side" : "Move to right side"}
      data-testid="position-toggle"
    >
      {position === 'bottom-right' ? (
        <AlignLeft className="h-4 w-4" />
      ) : (
        <AlignRight className="h-4 w-4" />
      )}
    </Button>
  );
}
