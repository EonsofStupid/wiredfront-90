import { ChatToggle } from "./components/ChatToggle";
import { ChatWindow } from "./components/ChatWindow";
import { ChatProvider } from "./providers/ChatProvider";

export function Chat() {
  return (
    <ChatProvider>
      <ChatWindow />
      <ChatToggle />
    </ChatProvider>
  );
}

export default Chat;
