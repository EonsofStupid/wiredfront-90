
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";
import { useChatStore } from '../store/chatStore';

export function ChatPositionToggle() {
  const { togglePosition } = useChatStore();
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePosition();
  };
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 hover:bg-white/10"
      onClick={handleClick}
      title="Toggle chat position"
    >
      <ArrowLeftRight className="h-4 w-4" />
    </Button>
  );
}
