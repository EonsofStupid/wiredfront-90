import { useState } from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor, DragStartEvent } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useMessageSubscription } from '@/hooks/useMessageSubscription';
import { ChatWindow } from './ChatWindow';
import { useToast } from "@/components/ui/use-toast";

interface Position {
  x: number;
  y: number;
}

export const DraggableChat = () => {
  const CHAT_WIDTH = 350;
  const CHAT_HEIGHT = 500;
  const MARGIN = 32;

  const [position, setPosition] = useState<Position>(() => ({
    x: window.innerWidth - CHAT_WIDTH - MARGIN,
    y: window.innerHeight - CHAT_HEIGHT - 48
  }));
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isTacked, setIsTacked] = useState(true);
  const { toast } = useToast();

  // Use a fixed session ID for now - in a real app, this would be dynamic
  const sessionId = 'default-session';
  const { messages, isLoading, error } = useMessageSubscription({
    sessionId,
    isMinimized,
    limit: 50,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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
      setPosition({
        x: window.innerWidth - CHAT_WIDTH - MARGIN,
        y: window.innerHeight - CHAT_HEIGHT - 48
      });
    }
  };

  if (error) {
    console.error('Chat error:', error);
  }

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToWindowEdges]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
    </DndContext>
  );
};