
import { useCurrentConversationId } from '@/components/chat/store/conversation';

export const useConversationId = () => {
  return useCurrentConversationId();
};
