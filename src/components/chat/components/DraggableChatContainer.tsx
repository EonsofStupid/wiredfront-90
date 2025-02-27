
import React, { useRef, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Card, CardHeader } from "@/components/ui/card";
import { ChatHeader } from "./ChatHeader";
import { ChatContent } from "./ChatContent";
import { useChatMode } from "../providers/ChatModeProvider";

interface DraggableChatContainerProps {
  showSidebar: boolean;
  isMinimized: boolean;
  onToggleSidebar: () => void;
  onMinimize: () => void;
  onClose: () => void;
  scrollRef: React.RefObject<HTMLDivElement>;
  isEditorPage: boolean;
}

export function DraggableChatContainer({
  showSidebar,
  isMinimized,
  onToggleSidebar,
  onMinimize,
  onClose,
  scrollRef,
  isEditorPage,
}: DraggableChatContainerProps) {
  const { mode } = useChatMode();
  const chatRef = useRef<HTMLDivElement>(null);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "chat-window",
  });

  const adjustedTransform = transform ? {
    x: transform.x,
    y: 0,
  } : undefined;

  const style = adjustedTransform ? {
    transform: `translate3d(${adjustedTransform.x}px, ${adjustedTransform.y}px, 0)`,
  } : undefined;

  useEffect(() => {
    if (!chatRef.current) return;

    const updatePosition = () => {
      if (!chatRef.current) return;
      const rect = chatRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      if (rect.right > viewportWidth) {
        const overflow = rect.right - viewportWidth;
        chatRef.current.style.transform = `translate3d(${-overflow}px, 0, 0)`;
      }
      if (rect.left < 0) {
        chatRef.current.style.transform = `translate3d(0, 0, 0)`;
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  // Determine the title based on the current mode
  const title = mode === 'editor' ? 'Code Assistant' : 'Chat';

  return (
    <div 
      ref={(node) => {
        setNodeRef(node);
        if (chatRef) {
          chatRef.current = node;
        }
      }}
      style={style}
      {...attributes}
      {...listeners}
      className="w-[400px]"
    >
      <Card className="shadow-xl glass-card neon-border">
        <CardHeader className="p-0">
          <ChatHeader 
            title={title}
            showSidebar={showSidebar}
            isMinimized={isMinimized}
            onToggleSidebar={onToggleSidebar}
            onMinimize={onMinimize}
            onClose={onClose}
          />
        </CardHeader>

        <ChatContent 
          scrollRef={scrollRef} 
          isMinimized={isMinimized} 
          isEditorPage={isEditorPage}
        />
      </Card>
    </div>
  );
}
