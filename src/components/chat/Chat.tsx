
import { useRef } from "react";
import { ChatContainer } from "./components/ChatContainer";
import { ChatProvider } from "./providers/ChatProvider";

// Import isolated CSS files
import "./styles/chat-variables.css";  // CSS variables scoped to chat
import "./styles/container.css";       // Container styles
import "./styles/theme.css";           // Theme-specific styles
import "./styles/chat-animations.css"; // Animation styles

/**
 * Main Chat component with isolated CSS
 * 
 * This component is carefully designed to maintain CSS isolation
 * from the rest of the application through scoped CSS variables
 * and nested selectors.
 */
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
