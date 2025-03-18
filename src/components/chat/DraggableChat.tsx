
import React, { useRef } from "react";
import DraggableChatContainer from "./components/DraggableChatContainer";

export function DraggableChat() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Determine if we're on an editor page based on current route
  const isEditorPage = window.location.pathname.includes('/editor');

  return (
    <DraggableChatContainer 
      scrollRef={scrollRef}
      isEditorPage={isEditorPage}
    />
  );
}

export default DraggableChat;
