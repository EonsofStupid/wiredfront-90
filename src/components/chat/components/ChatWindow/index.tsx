import { useAtom } from "jotai";
import { useRef } from "react";
import { isChatVisibleAtom, isMinimizedAtom } from "../../atoms/ui-atoms";
import { useChatStore } from "../../store/chatStore";
import { ChatContainer } from "../ChatContainer";

export function ChatWindow() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isOpen } = useChatStore();
  const [isMinimized] = useAtom(isMinimizedAtom);
  const [isVisible] = useAtom(isChatVisibleAtom);

  if (!isOpen || !isVisible) return null;

  return (
    <ChatContainer
      scrollRef={scrollRef}
      isMinimized={isMinimized}
      isEditorPage={false}
    />
  );
}
