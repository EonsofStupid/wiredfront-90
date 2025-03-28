
import { useEffect, useState } from 'react';
import { useConversationStore } from './store';
import { Conversation } from '../../types/conversation-types';

/**
 * Hook to get the current conversation ID
 */
export function useCurrentConversationId() {
  const { currentConversationId } = useConversationStore();
  return currentConversationId;
}

/**
 * Hook to get the current conversation
 */
export function useCurrentConversation(): Conversation | null {
  const { conversations, currentConversationId } = useConversationStore();
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    if (currentConversationId && conversations.length > 0) {
      const conversation = conversations.find(c => c.id === currentConversationId) || null;
      setCurrentConversation(conversation);
    } else {
      setCurrentConversation(null);
    }
  }, [currentConversationId, conversations]);

  return currentConversation;
}

/**
 * Hook to get active conversations 
 */
export function useActiveConversations() {
  const { conversations } = useConversationStore();
  const [activeConversations, setActiveConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const active = conversations.filter(c => !c.archived) || [];
    setActiveConversations(active);
  }, [conversations]);

  return activeConversations;
}

/**
 * Hook to get archived conversations
 */
export function useArchivedConversations() {
  const { conversations } = useConversationStore();
  const [archivedConversations, setArchivedConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const archived = conversations.filter(c => c.archived) || [];
    setArchivedConversations(archived);
  }, [conversations]);

  return archivedConversations;
}
