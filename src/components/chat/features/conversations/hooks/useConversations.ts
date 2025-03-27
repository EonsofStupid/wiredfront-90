
import { useCallback } from 'react';
import { useConversationStore } from '@/components/chat/store/conversation/store';
import { useChatBridge } from '@/components/chat/chatBridge';
import { useMessageStore } from '@/components/chat/messaging/MessageManager';
import { Conversation, CreateConversationParams } from '@/types/chat/conversation';
import { ChatMode } from '@/types/chat/enums';
import { toast } from 'sonner';

/**
 * Hook to manage conversations
 */
export const useConversations = () => {
  const { 
    conversations, 
    currentConversationId,
    isLoading,
    error,
    fetchConversations
  } = useConversationStore();
  const { clearMessages } = useMessageStore();
  const chatBridge = useChatBridge();
  
  // Get active (non-archived) conversations
  const activeConversations = Object.values(conversations)
    .filter(conv => !conv.archived)
    .sort((a, b) => new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime());
  
  // Get archived conversations
  const archivedConversations = Object.values(conversations)
    .filter(conv => conv.archived)
    .sort((a, b) => new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime());
  
  // Get conversations by mode
  const getConversationsByMode = useCallback((mode: ChatMode): Conversation[] => {
    return Object.values(conversations)
      .filter(conv => !conv.archived && conv.metadata?.mode === mode)
      .sort((a, b) => new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime());
  }, [conversations]);
  
  // Get the current conversation
  const currentConversation = currentConversationId ? conversations[currentConversationId] : null;
  
  // Create a new conversation
  const createConversation = useCallback(async (params: CreateConversationParams = {}) => {
    const conversationId = await chatBridge.createConversation(params);
    if (conversationId) {
      toast.success('New conversation created');
      // Clear messages to prepare for the new conversation
      clearMessages();
      // Set current conversation
      chatBridge.switchConversation(conversationId);
    }
    return conversationId;
  }, [chatBridge, clearMessages]);
  
  // Switch to a conversation
  const switchConversation = useCallback((conversationId: string) => {
    return chatBridge.switchConversation(conversationId);
  }, [chatBridge]);
  
  // Archive a conversation
  const archiveConversation = useCallback((conversationId: string) => {
    return chatBridge.archiveConversation(conversationId);
  }, [chatBridge]);
  
  // Delete a conversation
  const deleteConversation = useCallback((conversationId: string) => {
    return chatBridge.deleteConversation(conversationId);
  }, [chatBridge]);
  
  // Refresh conversations
  const refreshConversations = useCallback(() => {
    return fetchConversations();
  }, [fetchConversations]);
  
  return {
    activeConversations,
    archivedConversations,
    currentConversation,
    currentConversationId,
    isLoading,
    error,
    getConversationsByMode,
    createConversation,
    switchConversation,
    archiveConversation,
    deleteConversation,
    refreshConversations
  };
};
