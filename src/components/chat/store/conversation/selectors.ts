
import { Conversation } from '@/components/chat/types/chat/conversation';
import { useConversationStore } from './store';
import { useEffect, useMemo } from 'react';

/**
 * Hook to get the current conversation ID
 */
export const useCurrentConversationId = (): string | null => {
  return useConversationStore(state => state.currentConversationId);
};

/**
 * Hook to get the current conversation object
 */
export const useCurrentConversation = (): Conversation | null => {
  const conversations = useConversationStore(state => state.conversations);
  const currentConversationId = useConversationStore(state => state.currentConversationId);
  
  return useMemo(() => {
    if (!currentConversationId) return null;
    return conversations.find(c => c.id === currentConversationId) || null;
  }, [conversations, currentConversationId]);
};

/**
 * Hook to get conversation by ID
 */
export const useConversationById = (id: string | null): Conversation | null => {
  const conversations = useConversationStore(state => state.conversations);
  
  return useMemo(() => {
    if (!id) return null;
    return conversations.find(c => c.id === id) || null;
  }, [conversations, id]);
};
