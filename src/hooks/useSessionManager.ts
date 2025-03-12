
import { useState, useCallback } from 'react';
import { useMessageStore } from '@/components/chat/messaging/MessageManager';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { useChatStore } from '@/components/chat/store/chatStore';
import { 
  Session,
  CreateSessionParams,
  UpdateSessionParams
} from '@/types/sessions';
import { 
  fetchUserSessions, 
  createNewSession, 
  updateSession,
  switchToSession, 
  archiveSession,
  cleanupSessions 
} from '@/services/sessions/SessionService';
import { 
  useQuery, 
  useMutation, 
  useQueryClient 
} from '@tanstack/react-query';

// Query keys for TanStack Query
const QUERY_KEYS = {
  SESSIONS: ['sessions'],
  SESSION: (id: string) => ['session', id],
  MESSAGES: (sessionId: string) => ['messages', sessionId],
};

export function useSessionManager() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const { clearMessages, fetchSessionMessages } = useMessageStore();
  const { setSessionLoading } = useChatStore();
  const queryClient = useQueryClient();

  // Fetch all sessions with TanStack Query
  const { 
    data: sessions = [], 
    isLoading,
    isError,
    error,
    refetch: refreshSessions
  } = useQuery({
    queryKey: QUERY_KEYS.SESSIONS,
    queryFn: fetchUserSessions,
    meta: {
      errorMessage: 'Failed to load chat sessions'
    }
  });

  // Create a new session
  const { mutateAsync: createSession } = useMutation({
    mutationFn: (params?: CreateSessionParams) => createNewSession(params),
    onSuccess: (result) => {
      if (result.success && result.sessionId) {
        setCurrentSessionId(result.sessionId);
        clearMessages();
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SESSIONS });
        toast.success('New chat session created');
      }
    },
    onError: (err) => {
      toast.error('Failed to create new chat session');
      logger.error('Error creating session:', err);
    },
  });

  // Switch to an existing session
  const { mutateAsync: switchSession } = useMutation({
    mutationFn: (sessionId: string) => switchToSession(sessionId),
    onMutate: async (sessionId) => {
      setSessionLoading(true);
      
      if (sessionId === currentSessionId) {
        setSessionLoading(false);
        return;
      }
      
      setCurrentSessionId(sessionId);
      await fetchSessionMessages(sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SESSIONS });
    },
    onError: (err) => {
      toast.error('Failed to switch chat session');
      logger.error('Error switching session:', err);
    },
    onSettled: () => {
      setSessionLoading(false);
    },
  });

  // Update a session
  const { mutateAsync: updateSessionMutation } = useMutation({
    mutationFn: ({ sessionId, params }: { sessionId: string, params: UpdateSessionParams }) => 
      updateSession(sessionId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SESSIONS });
    },
    onError: (err) => {
      toast.error('Failed to update chat session');
      logger.error('Error updating session:', err);
    },
  });

  // Archive a session
  const { mutateAsync: archiveSessionMutation } = useMutation({
    mutationFn: (sessionId: string) => archiveSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SESSIONS });
      toast.success('Chat session archived');
    },
    onError: (err) => {
      toast.error('Failed to archive chat session');
      logger.error('Error archiving session:', err);
    },
  });

  // Clean up inactive sessions
  const { mutateAsync: cleanupInactiveSessions } = useMutation({
    mutationFn: (currentId: string) => {
      if (!currentId) {
        toast.error('No active session found');
        return Promise.resolve(0);
      }
      return cleanupSessions(currentId);
    },
    onSuccess: (deletedCount) => {
      if (deletedCount === 0) {
        toast.info('No inactive sessions to clean up');
      } else {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SESSIONS });
        toast.success(`Cleaned up ${deletedCount} inactive sessions`);
      }
    },
    onError: (err) => {
      toast.error('Failed to clean up inactive sessions');
      logger.error('Error cleaning up sessions:', err);
    },
  });

  // Get the current session
  const currentSession = useCallback(() => {
    if (!currentSessionId) return null;
    return sessions.find(session => session.id === currentSessionId) || null;
  }, [currentSessionId, sessions]);

  return {
    sessions,
    currentSessionId,
    currentSession: currentSession(),
    isLoading,
    isError,
    error,
    createSession: async (params?: CreateSessionParams) => {
      const result = await createSession(params);
      return result.success ? result.sessionId || '' : '';
    },
    switchSession: async (sessionId: string) => {
      await switchSession(sessionId);
    },
    updateSession: updateSessionMutation,
    archiveSession: archiveSessionMutation,
    cleanupInactiveSessions: async () => {
      if (currentSessionId) {
        await cleanupInactiveSessions(currentSessionId);
      }
    },
    refreshSessions: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SESSIONS })
  };
}
