import { useChatMode } from "../../providers/ChatModeProvider";
import { useChatStore } from "../../store/chatStore";
import { ChatToggleButton } from "../ChatToggleButton";

export function ChatToggle() {
  const { toggleChat, isOpen, isHidden } = useChatStore();
  const { mode } = useChatMode();

  if (isHidden) return null;

  return <ChatToggleButton onClick={toggleChat} isOpen={isOpen} mode={mode} />;
}
