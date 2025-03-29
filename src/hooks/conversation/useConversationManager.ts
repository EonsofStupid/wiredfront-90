
import { useConversationStore } from '@/components/chat/store/conversation';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { useMessageStore } from '@/components/chat/messaging/MessageManager';
import { useState, useEffect, useCallback } from 'react';
import { useConversationCleanup } from './useConversationCleanup';
import { Conversation, CreateConversationParams } from '@/components/chat/types/conversation-types';

/**
 * Main hook for managing conversations and related actions
 */
export function useConversationManager() {
  const { 
    conversations,
    currentConversationId, 
    setCurrentConversationId,
    createConversation: createNewConversation,
    updateConversation,
    archiveConversation,
    deleteConversation,
    fetchConversations: loadConversations,
    isLoading,
    error
  } = useConversationStore();

  const [activeConversations, setActiveConversations] = useState<Conversation[]>([]);
  const [archivedConversations, setArchivedConversations] = useState<Conversation[]>([]);
  const { clearMessages } = useMessageStore();

  // Get current conversation
  const currentConversation = currentConversationId 
    ? conversations.find(c => c.id === currentConversationId) || null 
    : null;

  // Load conversations on mount
  useEffect(() => {
    const fetchData = async () => {
      await loadConversations();
    };
    fetchData();
  }, []);

  // Filter active and archived conversations
  useEffect(() => {
    setActiveConversations(conversations.filter(c => !c.archived));
    setArchivedConversations(conversations.filter(c => c.archived));
  }, [conversations]);

  // Create a new conversation
  const createConversation = useCallback(async (params?: CreateConversationParams) => {
    try {
      const conversationId = createNewConversation(params);
      if (conversationId) {
        setCurrentConversationId(conversationId);
        clearMessages();
        toast.success('New conversation created');
        return conversationId;
      } else {
        toast.error('Failed to create conversation');
        return '';
      }
    } catch (error) {
      logger.error('Error creating conversation', error);
      toast.error('Failed to create conversation');
      return '';
    }
  }, [createNewConversation, setCurrentConversationId, clearMessages]);

  // Switch to a conversation
  const switchConversation = useCallback((conversationId: string) => {
    setCurrentConversationId(conversationId);
    return true;
  }, [setCurrentConversationId]);

  // Handle conversation cleanup
  const { 
    cleanupInactiveConversations, 
    clearConversations 
  } = useConversationCleanup(
    currentConversationId,
    clearMessages,
    createConversation,
    () => loadConversations()
  );

  return {
    // State
    conversations,
    activeConversations,
    archivedConversations,
    currentConversation,
    currentConversationId,
    isLoading,
    error,
    
    // Core operations
    createConversation,
    switchConversation,
    updateConversation,
    archiveConversation,
    deleteConversation,
    refreshConversations: async () => {
      await loadConversations();
    },
    
    // Cleanup utilities
    cleanupInactiveConversations,
    clearConversations
  };
}
