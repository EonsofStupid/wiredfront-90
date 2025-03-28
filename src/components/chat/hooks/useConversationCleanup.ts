
import { useEffect } from 'react';
import { useChatStore, clearMiddlewareStorage } from '@/components/chat/store/chatStore';
import { clearAllConversations } from '@/services/conversations/conversationDelete';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { messageCache } from '@/services/chat/MessageCacheService';

/**
 * Hook to handle chat conversation cleanup and persistence management
 */
export function useConversationCleanup(
  currentConversationId: string | null = null,
  clearMessages: () => void = () => {},
  createConversation: (params?: any) => Promise<string> = async () => '',
  refreshConversations: () => void = () => {}
) {
  const { resetChatState } = useChatStore();

  /**
   * Delete all conversations except the current one
   */
  const cleanupInactiveConversations = async () => {
    try {
      if (!currentConversationId) {
        toast.error('No active conversation');
        return;
      }
      
      const result = await clearAllConversations(currentConversationId);
      if (result.success) {
        toast.success('Inactive conversations cleared');
        logger.info('Inactive conversations cleared', { preservedConversation: currentConversationId });
        
        // Also clear local storage for inactive conversations
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('chat-conversation-') && !key.includes(currentConversationId)) {
            localStorage.removeItem(key);
          }
        });
      } else {
        toast.error('Failed to clear inactive conversations');
        logger.error('Failed to clear inactive conversations', result.error);
      }
    } catch (error) {
      toast.error('Error cleaning up conversations');
      logger.error('Error in cleanupInactiveConversations', error);
    }
  };

  /**
   * Completely flush all persistent storage and start fresh
   */
  const clearConversations = async (preserveCurrentConversation: boolean = false) => {
    try {
      // Clear DB conversations
      await clearAllConversations(preserveCurrentConversation ? currentConversationId : null);
      
      // Clear message cache
      messageCache.clearAllCache();
      
      // Clear messages from MessageStore
      clearMessages();
      
      // Reset chat state (clears Zustand store)
      resetChatState();
      
      // Force clear any middleware storage directly
      clearMiddlewareStorage();
      
      // If we're not preserving conversations, create a new one
      if (!preserveCurrentConversation) {
        const newConversationId = await createConversation();
        logger.info('New conversation created after clearing all', { newConversationId });
      }
      
      // Refresh conversations list
      refreshConversations();
      
      toast.success(
        preserveCurrentConversation 
          ? 'All conversations except current cleared' 
          : 'All conversations cleared, new conversation created'
      );
    } catch (error) {
      toast.error('Error clearing conversations');
      logger.error('Error in clearConversations', error);
    }
  };

  return {
    cleanupInactiveConversations,
    clearConversations
  };
}
