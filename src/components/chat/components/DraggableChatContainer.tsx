
import React, { useRef, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Card, CardHeader } from "@/components/ui/card";
import { ChatHeader } from "./ChatHeader";
import { ChatContent } from "./ChatContent";
import { useChatMode } from "../providers/ChatModeProvider";
import { useChatStore } from "../store/chatStore";
import { motion } from "framer-motion";
import { logger } from "@/services/chat/LoggingService";

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
  const { isMinimized, showSidebar, toggleSidebar, toggleMinimize, toggleChat, docked, position } = useChatStore();
  const prevPosition = useRef(position);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "chat-window",
    disabled: docked
  });

  const adjustedTransform = transform && !docked ? {
    x: transform.x,
    y: transform.y,
  } : undefined;

  const style = adjustedTransform ? {
    transform: `translate3d(${adjustedTransform.x}px, ${adjustedTransform.y}px, 0)`,
  } : undefined;

  // Handle position change and viewport boundaries
  useEffect(() => {
    if (!chatRef.current || docked) return;

    const updatePosition = () => {
      if (!chatRef.current) return;
      const rect = chatRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let transformX = 0;
      let transformY = 0;
      
      // Horizontal bounds
      if (rect.right > viewportWidth) {
        transformX = viewportWidth - rect.right - 20;
      } else if (rect.left < 0) {
        transformX = Math.abs(rect.left) + 20;
      }
      
      // Vertical bounds - ensure chat is fully in viewport
      if (rect.bottom > viewportHeight) {
        transformY = viewportHeight - rect.bottom - 20;
      } else if (rect.top < 0) {
        transformY = Math.abs(rect.top) + 20;
      }
      
      if (transformX !== 0 || transformY !== 0) {
        chatRef.current.style.transform = `translate3d(${transformX}px, ${transformY}px, 0)`;
        logger.info('Chat position adjusted to fit viewport', { transformX, transformY });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [docked]);

  // Log position changes
  useEffect(() => {
    if (prevPosition.current !== position) {
      logger.info('Chat position changed', { from: prevPosition.current, to: position });
      prevPosition.current = position;
    }
  }, [position]);

  // Determine the title based on the current mode
  const title = mode === 'editor' ? 'Code Assistant' : mode === 'chat-only' ? 'Context Planning' : 'Chat';

  // Stop propagation for clicks inside the chat window
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <motion.div 
      ref={(node) => {
        setNodeRef(node);
        if (chatRef) {
          chatRef.current = node;
        }
      }}
      style={style}
      {...(docked ? {} : { ...attributes, ...listeners })}
      className="w-[var(--chat-width)] transition-all duration-300 chat-container"
      onClick={handleContainerClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      data-testid="chat-container"
    >
      <Card className="shadow-xl glass-card neon-border overflow-hidden h-full">
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
    </motion.div>
  );
}
