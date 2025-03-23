import { ChatProvider } from "./ChatProvider";
import { DraggableChatContainer } from "./components/DraggableChatContainer";
import { useInitializeChat } from "./hooks/useInitializeChat";
import { useTheme } from "./hooks/useTheme";

interface ChatContainerProps {
  // Add any props if needed
}

export function ChatContainer() {
  const { isInitialized } = useInitializeChat();
  const { theme } = useTheme();

  if (!isInitialized) {
    return null;
  }

  return (
    <ChatProvider>
      <DraggableChatContainer theme={theme} />
    </ChatProvider>
  );
}

export default ChatContainer;
