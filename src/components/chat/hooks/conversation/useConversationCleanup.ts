
import { useCallback } from 'react';
import { CreateConversationParams } from '@/types/chat/conversation';

/**
 * Hook for cleaning up conversations
 * This is separated from the main conversation manager to focus responsibilities
 */
export function useConversationCleanup(
  currentConversationId: string | null,
  clearMessages: () => void,
  createConversation: (params?: CreateConversationParams) => Promise<string>,
  loadConversations: () => Promise<any[]>
) {
  // Clean up inactive conversations (archived or older than a threshold)
  const cleanupInactiveConversations = useCallback(async () => {
    // This function would typically call a database function to clean up
    // For now, we'll just refresh the conversations to get the latest state
    await loadConversations();
    return true;
  }, [loadConversations]);

  // Clear all conversations
  const clearConversations = useCallback(async () => {
    // After clearing, create a new conversation and set it as active
    clearMessages();
    if (!currentConversationId) {
      await createConversation();
    }
    return true;
  }, [clearMessages, createConversation, currentConversationId]);

  return {
    cleanupInactiveConversations,
    clearConversations,
  };
}
