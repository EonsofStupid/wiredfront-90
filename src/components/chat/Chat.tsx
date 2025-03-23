
import { useRef } from "react";
import { ChatContainer } from "./components/ChatContainer";
import { ChatProvider } from "./providers/ChatProvider";
import "./styles/chat-variables.css";
import "./styles/container.css";
import "./styles/theme.css";

export function Chat() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  console.log("Chat component rendering with isolated CSS");

  return (
    <ChatProvider>
      <ChatContainer scrollRef={scrollRef} isEditorPage={false} />
    </ChatProvider>
  );
}

export default Chat;
