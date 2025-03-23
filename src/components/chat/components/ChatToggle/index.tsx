import { useAtom } from "jotai";
import {
  chatPositionAtom,
  currentModeAtom,
  isChatVisibleAtom,
} from "../../atoms/ui-atoms";
import { useChatStore } from "../../store/chatStore";
import { ChatToggleButton } from "../ChatToggleButton";

export function ChatToggle() {
  const { toggleChat, isOpen, isHidden } = useChatStore();
  const [position] = useAtom(chatPositionAtom);
  const [mode] = useAtom(currentModeAtom);
  const [isVisible] = useAtom(isChatVisibleAtom);

  if (isHidden || !isVisible) return null;

  return (
    <ChatToggleButton
      onClick={toggleChat}
      isOpen={isOpen}
      mode={mode}
      position={position}
    />
  );
}
