import React from 'react';
import { ChatWindow } from "@/features/chat/ui/ChatWindow";
import { useChat } from "@/features/chat/core/providers/ChatProvider";

const DraggableChat = () => {
  const chat = useChat();
  return <ChatWindow />;
};

export { DraggableChat };
export default DraggableChat;