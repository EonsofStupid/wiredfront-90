
import { useState, useEffect, useCallback } from 'react';
import { useMessageStore } from '@/components/chat/messaging/MessageManager';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { useChatStore } from '@/components/chat/store/chatStore';
import { Session } from '@/types/sessions';
import { 
  fetchUserSessions, 
  createNewSession, 
  switchToSession, 
  cleanupSessions 
} from '@/services/sessions/SessionService';

export type { Session } from '@/types/sessions';

export function useSessionManager() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { clearMessages, fetchSessionMessages } = useMessageStore();
  const { setSessionLoading } = useChatStore();

  const fetchSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      setSessionLoading(true);
      
      const sessionsData = await fetchUserSessions();
      setSessions(sessionsData);
      
      // If we have sessions but no current session, set the most recent
      if (sessionsData.length > 0 && !currentSessionId) {
        setCurrentSessionId(sessionsData[0].id);
        await fetchSessionMessages(sessionsData[0].id);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load chat sessions');
    } finally {
      setIsLoading(false);
      setSessionLoading(false);
    }
  }, [currentSessionId, fetchSessionMessages, setSessionLoading]);

  const createSession = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const sessionId = await createNewSession();
      
      // Switch to the new session
      setCurrentSessionId(sessionId);
      clearMessages();
      
      // Update sessions list
      await fetchSessions();
      
      toast.success('New chat session created');
      
      return sessionId; // Return the sessionId
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create new chat session');
      return ''; // Return empty string on error
    } finally {
      setIsLoading(false);
    }
  }, [clearMessages, fetchSessions]);

  const switchSession = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true);
      setSessionLoading(true);
      
      if (sessionId === currentSessionId) return;
      
      // Set current session and fetch messages
      setCurrentSessionId(sessionId);
      await fetchSessionMessages(sessionId);
      
      // Update the session's last_accessed timestamp
      await switchToSession(sessionId);
    } catch (error) {
      console.error('Error switching session:', error);
      toast.error('Failed to switch chat session');
    } finally {
      setIsLoading(false);
      setSessionLoading(false);
    }
  }, [currentSessionId, fetchSessionMessages, setSessionLoading]);

  const cleanupInactiveSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (!currentSessionId) {
        toast.error('No active session found');
        return;
      }
      
      const deletedCount = await cleanupSessions(currentSessionId);
      
      if (deletedCount === 0) {
        toast.info('No inactive sessions to clean up');
        return;
      }

      // Refresh sessions list
      await fetchSessions();
      
      toast.success(`Cleaned up ${deletedCount} inactive sessions`);
    } catch (error) {
      console.error('Error cleaning up sessions:', error);
      toast.error('Failed to clean up inactive sessions');
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId, fetchSessions]);

  // Initialize sessions on component mount
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    currentSessionId,
    isLoading,
    fetchSessions,
    createSession,
    switchSession,
    cleanupInactiveSessions,
    refreshSessions: fetchSessions, // Alias for backwards compatibility
  };
}
