
import { useState, useCallback } from 'react';
import { useSessionCore } from './useSessionCore';
import { useSessionCreation } from './useSessionCreation';
import { useSessionSwitching } from './useSessionSwitching';
import { useSessionUpdates } from './useSessionUpdates';
import { useSessionCleanup } from './useSessionCleanup';
import { useChatStore } from '@/components/chat/store/chatStore';
import { useMessageStore } from '@/components/chat/messaging/MessageManager';
import { CreateSessionParams } from '@/types/sessions';
import { ChatMode } from '@/components/chat/store/types/chat-store-types';
import { toast } from 'sonner';

/**
 * Primary hook for managing chat sessions
 */
export function useSessionManager() {
  const { setSessionLoading } = useChatStore();
  const { clearMessages } = useMessageStore();
  
  // Use the core session hook for basic state
  const {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    currentSession,
    isLoading,
    isError,
    error,
    refreshSessions,
  } = useSessionCore();
  
  // Fetch messages for a session
  const fetchSessionMessages = useCallback(async (sessionId: string) => {
    // This would typically fetch messages for the current session
    // For now, we'll just clear messages when switching sessions
    clearMessages();
  }, [clearMessages]);
  
  // Initialize session actions
  const { createSession } = useSessionCreation(setCurrentSessionId, clearMessages);
  
  const { switchSession } = useSessionSwitching(
    setCurrentSessionId,
    fetchSessionMessages,
    setSessionLoading,
    currentSessionId
  );
  
  const { updateSession, archiveSession } = useSessionUpdates();
  
  const { clearSessions, cleanupInactiveSessions } = useSessionCleanup(
    currentSessionId,
    clearMessages,
    createSession,
    refreshSessions
  );
  
  // Create a session with modern params
  const createSessionWithParams = useCallback(async (params?: CreateSessionParams) => {
    try {
      const sessionId = await createSession(params);
      return sessionId || '';
    } catch (error) {
      toast.error('Failed to create session');
      console.error('Error creating session:', error);
      return '';
    }
  }, [createSession]);

  return {
    sessions,
    currentSessionId,
    currentSession,
    isLoading,
    isError,
    error,
    refreshSessions,
    createSession: createSessionWithParams,
    switchSession,
    updateSession,
    archiveSession,
    clearSessions,
    cleanupInactiveSessions,
  };
}
