
import { useCallback, useRef, useEffect } from "react";
import { ChatContainer } from "./components/ChatContainer";
import { ChatProvider } from "./providers/ChatProvider";
import { ChatToggleButton } from "./components/ChatToggleButton";
import { useChatStore } from "./store/chatStore";

// Import isolated CSS files
import "./styles/chat-variables.css";  // CSS variables scoped to chat
import "./styles/Chat-Zlayer.css";     // Z-layer variables
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
  const { isOpen, toggleChat } = useChatStore();
  
  // Log component mounting for debugging
  useEffect(() => {
    console.log("Chat component mounted with state:", { isOpen });
  }, [isOpen]);
  
  const handleToggleChat = useCallback(() => {
    console.log("Toggle chat button clicked, current state:", { isOpen });
    toggleChat();
  }, [toggleChat, isOpen]);
  
  return (
    <ChatProvider>
      {/* Only render the container when chat is open */}
      {isOpen && <ChatContainer scrollRef={scrollRef} isEditorPage={false} />}
      
      {/* Always render the toggle button */}
      <ChatToggleButton onClick={handleToggleChat} />
    </ChatProvider>
  );
}

export default Chat;
