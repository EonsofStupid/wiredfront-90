import { useState } from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useMessageSubscription } from '@/hooks/useMessageSubscription';
import { useSessionId } from '@/hooks/useSessionId';
import { useWindowPosition } from '@/hooks/useWindowPosition';
import { ChatWindow } from './ChatWindow';
import { ChatDragContext } from './ChatDragContext';
import { useToast } from "@/components/ui/use-toast";

export const DraggableChat = () => {
  const CHAT_WIDTH = 350;
  const CHAT_HEIGHT = 500;
  const MARGIN = 32;

  const sessionId = useSessionId();
  const { position, setPosition, resetPosition } = useWindowPosition({
    width: CHAT_WIDTH,
    height: CHAT_HEIGHT,
    margin: MARGIN,
  });

  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isTacked, setIsTacked] = useState(true);
  const { toast } = useToast();

  const { messages, isLoading, error } = useMessageSubscription({
    sessionId,
    isMinimized,
    limit: 50,
  });

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    if (isTacked) {
      setIsTacked(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    if (!isTacked) {
      const { delta } = event;
      setPosition((prev) => ({
        x: prev.x + delta.x,
        y: prev.y + delta.y,
      }));
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    toast({
      title: "Chat closed",
      description: "You can reopen the chat from the menu",
    });
  };

  const handleTackToggle = () => {
    setIsTacked(!isTacked);
    if (!isTacked) {
      resetPosition();
    }
  };

  if (error) {
    console.error('Chat error:', error);
  }

  return (
    <ChatDragContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <ChatWindow
        position={position}
        isMinimized={isMinimized}
        messages={messages}
        isLoading={isLoading}
        onMinimize={handleMinimize}
        onClose={handleClose}
        isDragging={isDragging}
        isTacked={isTacked}
        onTackToggle={handleTackToggle}
        dimensions={{ width: CHAT_WIDTH, height: CHAT_HEIGHT }}
      />
    </ChatDragContext>
  );
};