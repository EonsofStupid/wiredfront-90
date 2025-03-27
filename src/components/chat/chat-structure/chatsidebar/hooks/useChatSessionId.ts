
// Update import for useChatSessionManager
import { useChatSessionManager } from "@/components/chat/hooks/chat-sessions";

export const useSessionId = () => {
  const { currentSessionId } = useChatSessionManager();
  return currentSessionId;
};
