
import React, { useRef, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Card, CardHeader } from "@/components/ui/card";
import { ChatHeader } from "./ChatHeader";
import { ChatContent } from "./ChatContent";
import { useChatMode } from "../providers/ChatModeProvider";
import { useChatUIStore } from "../store/useChatUIStore";

interface DraggableChatContainerProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  isEditorPage: boolean;
}

export function DraggableChatContainer({
  scrollRef,
  isEditorPage,
}: DraggableChatContainerProps) {
  const { mode } = useChatMode();
  const chatRef = useRef<HTMLDivElement>(null);
  const { isMinimized, showSidebar, toggleSidebar, toggleMinimize, toggleChat, docked } = useChatUIStore();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "chat-window",
  });

  const adjustedTransform = transform && !docked ? {
    x: transform.x,
    y: transform.y,
  } : undefined;

  const style = adjustedTransform ? {
    transform: `translate3d(${adjustedTransform.x}px, ${adjustedTransform.y}px, 0)`,
  } : undefined;

  useEffect(() => {
    if (!chatRef.current || docked) return;

    const updatePosition = () => {
      if (!chatRef.current) return;
      const rect = chatRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      if (rect.right > viewportWidth) {
        const overflow = rect.right - viewportWidth + 20; // 20px margin
        chatRef.current.style.transform = `translate3d(${-overflow}px, 0, 0)`;
      }
      
      if (rect.left < 0) {
        chatRef.current.style.transform = `translate3d(${Math.abs(rect.left) + 20}px, 0, 0)`;
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [docked]);

  // Determine the title based on the current mode
  const title = mode === 'editor' ? 'Code Assistant' : mode === 'chat-only' ? 'Context Planning' : 'Chat';

  // Stop propagation for clicks inside the chat window
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      ref={(node) => {
        setNodeRef(node);
        if (chatRef) {
          chatRef.current = node;
        }
      }}
      style={style}
      {...(docked ? {} : { ...attributes, ...listeners })}
      className="w-[400px] transition-all duration-300"
      onClick={handleContainerClick}
    >
      <Card className="shadow-xl glass-card wfpulse-neon-border overflow-hidden">
        <CardHeader className={`p-0 ${docked ? '' : 'cursor-move'}`}>
          <ChatHeader 
            title={title}
            showSidebar={showSidebar}
            isMinimized={isMinimized}
            onToggleSidebar={toggleSidebar}
            onMinimize={toggleMinimize}
            onClose={toggleChat}
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
