import { useRef } from "react";
import { ChatContainer } from "./components/ChatContainer";
import { ChatProvider } from "./providers/ChatProvider";

export function Chat() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <ChatProvider>
      <ChatContainer scrollRef={scrollRef} isEditorPage={false} />
    </ChatProvider>
  );
}

export default Chat;
