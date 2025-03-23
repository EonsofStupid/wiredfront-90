import { useRef } from "react";
import { ChatProvider } from "./ChatProvider";
import { ChatContainer } from "./components/ChatContainer";

export function ChatWrapper() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <ChatProvider>
      <ChatContainer scrollRef={scrollRef} isEditorPage={false} />
    </ChatProvider>
  );
}

export default ChatWrapper;
