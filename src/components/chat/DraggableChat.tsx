import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor, DragStartEvent } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { supabase } from "@/integrations/supabase/client";
import { ChatWindow } from './ChatWindow';
import { useToast } from "@/components/ui/use-toast";

interface Position {
  x: number;
  y: number;
}

export const DraggableChat = () => {
  const [position, setPosition] = useState<Position>({ x: window.innerWidth - 400, y: window.innerHeight - 600 });
  const [messages, setMessages] = useState<any[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isTacked, setIsTacked] = useState(false);
  const [windowState, setWindowState] = useState({ width: 350, height: 500 });
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    // Subscribe to real-time messages
    const channel = supabase
      .channel('chat-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          setMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
      // When tacking, move to bottom right
      setPosition({ 
        x: window.innerWidth - windowState.width - 32, 
        y: window.innerHeight - windowState.height - 48 
      });
    }
  };

  const handleResize = (width: number, height: number) => {
    setWindowState({ width, height });
  };

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
        onMinimize={handleMinimize}
        onClose={handleClose}
        isDragging={isDragging}
        isTacked={isTacked}
        onTackToggle={handleTackToggle}
        windowState={windowState}
        onResize={handleResize}
      />
    </DndContext>
  );
};