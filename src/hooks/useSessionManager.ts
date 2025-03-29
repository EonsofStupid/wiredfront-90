
import { useState, useEffect, useCallback } from 'react';
import { useConversationManager } from '@/hooks/conversation/useConversationManager';
import { CreateConversationParams } from '@/components/chat/types/chat/conversation';
import { ChatMode } from '@/components/chat/types/chat/enums';

/**
 * Hook that manages chat sessions
 */
export function useSessionManager() {
  const {
    conversations,
    currentConversationId,
    currentConversation,
    isLoading,
    error,
    loadConversations,
    createConversation,
    updateConversation,
    archiveConversation,
    deleteConversation,
    setCurrentConversationId,
    cleanupInactiveConversations,
    clearConversations,
    refreshConversations
  } = useConversationManager();
  
  // Ensure we have a conversation
  useEffect(() => {
    const ensureConversation = async () => {
      if (conversations.length === 0 && !isLoading) {
        await createConversation();
      } else if (conversations.length > 0 && !currentConversationId) {
        setCurrentConversationId(conversations[0].id);
      }
    };
    
    ensureConversation();
  }, [conversations, isLoading, currentConversationId, createConversation, setCurrentConversationId]);
  
  // Create new session
  const createNewSession = useCallback((params?: CreateConversationParams) => {
    return createConversation(params);
  }, [createConversation]);
  
  // Switch to an existing session
  const switchSession = useCallback((sessionId: string) => {
    setCurrentConversationId(sessionId);
    return true;
  }, [setCurrentConversationId]);
  
  // Update session
  const updateSession = useCallback((sessionId: string, updates: { title?: string, mode?: ChatMode }) => {
    return updateConversation(sessionId, updates);
  }, [updateConversation]);
  
  // Delete session
  const deleteSession = useCallback((sessionId: string) => {
    return deleteConversation(sessionId);
  }, [deleteConversation]);
  
  // Refresh sessions
  const refreshSessions = useCallback(() => {
    return loadConversations();
  }, [loadConversations]);
  
  return {
    // State
    sessions: conversations,
    currentSessionId: currentConversationId,
    currentSession: currentConversation,
    isLoading,
    error,
    
    // Operations
    createNewSession,
    switchSession,
    updateSession,
    deleteSession,
    refreshSessions,
    
    // Cleanup
    cleanupInactiveSessions: cleanupInactiveConversations,
    clearSessions: clearConversations
  };
}
