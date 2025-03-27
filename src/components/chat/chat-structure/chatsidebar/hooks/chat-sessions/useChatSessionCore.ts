import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Session } from '@/types/sessions';
import { fetchUserSessions } from '@/components/chat/shared/services/chat-sessions';
import { logger } from '@/services/chat/LoggingService';

// Define query keys in a central location
export const CHAT_SESSION_QUERY_KEYS = {
  SESSIONS: ['chat-sessions'],
  SESSION: (id: string) => ['chat-session', id],
  MESSAGES: (sessionId: string) => ['messages', sessionId],
};

/**
 * Core hook for session state and fetching
 */
export function useChatSessionCore() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const { 
    data: sessions = [] as Session[],
    isLoading,
    isError,
    error,
    refetch: refreshSessions
  } = useQuery({
    queryKey: CHAT_SESSION_QUERY_KEYS.SESSIONS,
    queryFn: fetchUserSessions,
    meta: {
      errorMessage: 'Failed to load chat sessions'
    }
  });

  // Find current session based on ID
  const currentSession = useCallback(() => {
    if (!currentSessionId) return null;
    return sessions.find(session => session.id === currentSessionId) || null;
  }, [currentSessionId, sessions])();

  return {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    currentSession,
    isLoading,
    isError,
    error,
    refreshSessions,
  };
}
