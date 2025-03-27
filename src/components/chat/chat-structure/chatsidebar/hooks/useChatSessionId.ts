
// Update import for useChatSessionManager
import { useChatSessionManager } from "./chat-sessions";

export const useSessionId = () => {
  const { currentSessionId } = useChatSessionManager();
  return currentSessionId;
};
