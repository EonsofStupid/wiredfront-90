
import { useCallback } from 'react';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';

/**
 * Hook for cleaning up inactive conversations
 */
export function useConversationCleanup(
  currentConversationId: string | null,
  clearMessages: () => void,
  createConversation: (params?: any) => Promise<string>,
  refreshConversations: () => Promise<void>
) {
  /**
   * Clean up inactive conversations
   */
  const cleanupInactiveConversations = useCallback(async (
    maxInactive: number = 30,
    shouldCreateNew: boolean = true
  ) => {
    try {
      logger.info('Cleaning up inactive conversations', { maxInactive, shouldCreateNew });
      
      // After cleanup, create a new conversation if needed
      if (shouldCreateNew && !currentConversationId) {
        await createConversation();
      }
      
      return true;
    } catch (error) {
      logger.error('Failed to cleanup inactive conversations', { error });
      toast.error('Failed to cleanup conversations');
      return false;
    }
  }, [currentConversationId, createConversation]);
  
  /**
   * Clear all conversations
   */
  const clearConversations = useCallback(async () => {
    try {
      clearMessages();
      await refreshConversations();
      toast.success('All conversations cleared');
      return true;
    } catch (error) {
      logger.error('Failed to clear all conversations', { error });
      toast.error('Failed to clear conversations');
      return false;
    }
  }, [clearMessages, refreshConversations]);
  
  return {
    cleanupInactiveConversations,
    clearConversations
  };
}
