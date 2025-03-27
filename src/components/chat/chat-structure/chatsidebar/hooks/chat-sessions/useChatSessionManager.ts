import { useMessageStore } from '@/components/chat/store/message';
import { useChatSessionStore } from '@/components/chat/store/chat-sessions/store';
import { useCallback, useEffect, useState } from 'react';
import { CreateSessionParams } from '@/types/sessions';
import { toast } from 'sonner';

/**
 * Hook for managing chat sessions
 */
export function useChatSessionManager() {
  const {
    sessions,
    currentSessionId,
    isLoading,
    fetchSessions,
    createSession,
    switchSession,
    updateSession,
    archiveSession,
    clearSessions,
    cleanupInactiveSessions
  } = useChatSessionStore();

  const { clearMessages, fetchSessionMessages } = useMessageStore();
  const [initialized, setInitialized] = useState(false);

  // Initialize hook by fetching sessions
  useEffect(() => {
    const initialize = async () => {
      if (!initialized) {
        try {
          await fetchSessions();
          
          // Load messages for current session if any
          if (currentSessionId) {
            await fetchSessionMessages(currentSessionId);
          }
          
          setInitialized(true);
        } catch (error) {
          console.error('Failed to initialize sessions:', error);
          toast.error('Failed to load chat sessions');
        }
      }
    };
    
    initialize();
  }, [fetchSessions, currentSessionId, fetchSessionMessages, initialized]);

  // Handle switching sessions with message loading
  const handleSwitchSession = useCallback(async (sessionId: string) => {
    try {
      clearMessages(); // Clear current messages before switching
      await switchSession(sessionId);
      await fetchSessionMessages(sessionId);
      toast.success('Switched to session');
    } catch (error) {
      console.error('Failed to switch session:', error);
      toast.error('Failed to switch session');
    }
  }, [clearMessages, switchSession, fetchSessionMessages]);

  // Create a new session with defaults
  const handleCreateSession = useCallback(async (params: CreateSessionParams = {}) => {
    try {
      clearMessages(); // Clear current messages
      const sessionId = await createSession({
        title: params.title || 'New Chat',
        metadata: params.metadata || {}
      });
      toast.success('Created new chat session');
      return sessionId;
    } catch (error) {
      console.error('Failed to create session:', error);
      toast.error('Failed to create new session');
      throw error;
    }
  }, [clearMessages, createSession]);

  // Clean up old/inactive sessions
  const handleCleanupSessions = useCallback(async () => {
    try {
      await cleanupInactiveSessions();
      toast.success('Cleaned up inactive sessions');
    } catch (error) {
      console.error('Failed to cleanup sessions:', error);
      toast.error('Failed to cleanup sessions');
    }
  }, [cleanupInactiveSessions]);

  // Clear sessions, optionally keeping the current one
  const handleClearSessions = useCallback(async (preserveCurrentSession: boolean = true) => {
    try {
      await clearSessions(preserveCurrentSession);
      
      if (!preserveCurrentSession) {
        clearMessages();
      }
      
      toast.success(
        preserveCurrentSession
          ? 'Cleared other sessions'
          : 'Cleared all sessions'
      );
    } catch (error) {
      console.error('Failed to clear sessions:', error);
      toast.error('Failed to clear sessions');
    }
  }, [clearSessions, clearMessages]);

  return {
    // Data
    sessions,
    currentSessionId,
    isLoading,
    
    // Actions
    createSession: handleCreateSession,
    switchSession: handleSwitchSession,
    updateSession,
    archiveSession,
    clearSessions: handleClearSessions,
    cleanupInactiveSessions: handleCleanupSessions,
    refreshSessions: fetchSessions
  };
}

export const useSessionManager = useChatSessionManager;
