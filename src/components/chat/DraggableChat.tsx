
import React, { useState, useRef } from "react";
import { DndContext } from "@dnd-kit/core";
import { useChat } from "./ChatProvider";
import { ChatSidebar } from "./ChatSidebar";
import { ChatToggleButton } from "./components/ChatToggleButton";
import { DraggableChatContainer } from "./components/DraggableChatContainer";

export function DraggableChat() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const { isOpen, toggleChat, isEditorPage } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!isOpen) {
    return <ChatToggleButton onClick={toggleChat} />;
  }

  return (
    <DndContext>
      <div className="fixed bottom-4 right-4 flex gap-4 z-[var(--z-chat)]">
        {showSidebar && <ChatSidebar />}
        
        <DraggableChatContainer
          showSidebar={showSidebar}
          isMinimized={isMinimized}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          onMinimize={() => setIsMinimized(!isMinimized)}
          onClose={toggleChat}
          scrollRef={scrollRef}
          isEditorPage={isEditorPage}
        />
      </div>
    </DndContext>
  );
}

export default DraggableChat;
