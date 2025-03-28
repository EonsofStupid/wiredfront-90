
import { useConversationStore } from './store';

/**
 * Hook to get the current conversation
 */
export const useCurrentConversation = () => {
  const { currentConversation } = useConversationStore();
  return currentConversation;
};

/**
 * Hook to get the current conversation ID
 */
export const useCurrentConversationId = () => {
  const { currentConversationId } = useConversationStore();
  return currentConversationId;
};
