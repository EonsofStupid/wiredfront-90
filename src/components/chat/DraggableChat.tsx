import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { delta } = event;
    setPosition((prev) => ({
      x: prev.x + delta.x,
      y: prev.y + delta.y,
    }));
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    // Implement close functionality
    toast({
      title: "Chat closed",
      description: "You can reopen the chat from the menu",
    });
  };

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToWindowEdges]}
      onDragEnd={handleDragEnd}
    >
      <ChatWindow
        position={position}
        isMinimized={isMinimized}
        messages={messages}
        onMinimize={handleMinimize}
        onClose={handleClose}
      />
    </DndContext>
  );
};