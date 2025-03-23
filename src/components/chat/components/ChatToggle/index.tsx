import { useChatMode } from "../../providers/ChatModeProvider";
import { useChatStore } from "../../store/chatStore";
import { ChatToggleButton } from "../ChatToggleButton";

export function ChatToggle() {
  const { toggleChat, isOpen } = useChatStore();
  const { mode } = useChatMode();

  return <ChatToggleButton onClick={toggleChat} isOpen={isOpen} mode={mode} />;
}
