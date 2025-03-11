
import React, { useRef, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { ChatSidebar } from "./ChatSidebar";
import { ChatToggleButton } from "./components/ChatToggleButton";
import { DraggableChatContainer } from "./components/DraggableChatContainer";
import { useViewportAwareness } from "./hooks/useViewportAwareness";
import { useChatUIStore } from "./store/useChatUIStore";
import { useLocation } from "react-router-dom";

export function DraggableChat() {
  const { isOpen, toggleChat, position, isMinimized, showSidebar, toggleSidebar } = useChatUIStore();
  const { containerRef, isOverflowing } = useViewportAwareness();
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isEditorPage = location.pathname === '/editor';

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (scrollRef.current && !isMinimized) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isMinimized]);

  if (!isOpen) {
    return <ChatToggleButton onClick={toggleChat} />;
  }

  const positionClass = position === 'bottom-right' ? 'right-4' : 'left-4';

  return (
    <DndContext>
      <div 
        className={`fixed bottom-4 ${positionClass} flex gap-4 z-[var(--z-chat)]`}
        style={{ 
          transition: 'all 0.3s ease',
          transform: isOverflowing ? `scale(${useChatUIStore.getState().scale})` : 'scale(1)',
          transformOrigin: position === 'bottom-right' ? 'bottom right' : 'bottom left'
        }}
        ref={containerRef}
      >
        {showSidebar && <ChatSidebar />}
        
        <DraggableChatContainer
          scrollRef={scrollRef}
          isEditorPage={isEditorPage}
        />
      </div>
    </DndContext>
  );
}

export default DraggableChat;
