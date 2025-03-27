import { useChatSessionManager } from '@/components/chat/chat-structure/chatsidebar/hooks/chat-sessions/useChatSessionManager';

export const useSessionId = () => {
  const { currentSessionId } = useChatSessionManager();
  return currentSessionId;
};
