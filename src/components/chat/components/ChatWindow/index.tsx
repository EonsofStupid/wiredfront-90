import { useRef } from "react";
import { useChatStore } from "../../store/chatStore";
import { ChatContainer } from "../ChatContainer";

export function ChatWindow() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isOpen, isMinimized } = useChatStore();

  if (!isOpen) return null;

  return (
    <ChatContainer
      scrollRef={scrollRef}
      isMinimized={isMinimized}
      isEditorPage={false}
    />
  );
}
