
import React, { useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import { useChatMode } from "../providers/ChatModeProvider";
import { useChatStore } from "../store";
import { useDragBoundaries } from "../hooks/useDragBoundaries";
import { ChatContainerCard } from "./ChatContainerCard";
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
  const { isMinimized, showSidebar, toggleSidebar, toggleMinimize, toggleChat, docked, position } = useChatStore();
  
  // Use the drag boundaries hook
  const { elementRef } = useDragBoundaries({ docked, position });
  
  // Set up draggable functionality
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

  // Determine the title based on the current mode
  const title = mode === 'editor' ? 'Code Assistant' : mode === 'chat-only' ? 'Context Planning' : 'Chat';

  // Stop propagation for clicks inside the chat window
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Combine refs for both drag functionality and boundary checking
  const setRefs = (node: HTMLDivElement) => {
    setNodeRef(node);
    elementRef.current = node;
  };

  return (
    <ChatContainerCard
      title={title}
      showSidebar={showSidebar}
      isMinimized={isMinimized}
      onToggleSidebar={toggleSidebar}
      onMinimize={toggleMinimize}
      onClose={toggleChat}
      scrollRef={scrollRef}
      isEditorPage={isEditorPage}
      docked={docked}
      style={style}
      onClick={handleContainerClick}
      containerRef={setRefs}
      dragHandleProps={{ ...attributes, ...listeners }}
    />
  );
}
