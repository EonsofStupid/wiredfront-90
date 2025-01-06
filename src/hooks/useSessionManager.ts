import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

interface SessionState {
  id: string;
  lastAccessed: Date;
  isActive: boolean;
}

export const useSessionManager = () => {
  const [sessions, setSessions] = useState<SessionState[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    return localStorage.getItem('chat_session_id') || crypto.randomUUID();
  });

  // Fetch active sessions
  const fetchSessions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('chat_session_id, last_accessed')
        .order('last_accessed', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Process the data only if we have results
      if (data) {
        const uniqueSessions = Array.from(
          new Map(
            data.map(item => [
              item.chat_session_id,
              {
                id: item.chat_session_id!,
                lastAccessed: new Date(item.last_accessed!),
                isActive: item.chat_session_id === currentSessionId
              }
            ])
          ).values()
        );

        setSessions(uniqueSessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to fetch sessions');
    }
  }, [currentSessionId]);

  // Switch to a different session
  const switchSession = useCallback(async (sessionId: string) => {
    try {
      // Update last_accessed for the current session
      const { error } = await supabase
        .from('messages')
        .update({ last_accessed: new Date().toISOString() })
        .eq('chat_session_id', sessionId);

      if (error) throw error;

      setCurrentSessionId(sessionId);
      localStorage.setItem('chat_session_id', sessionId);
      toast.success('Switched to different chat session');
      
      // Refresh sessions after switching
      await fetchSessions();
    } catch (error) {
      console.error('Error switching sessions:', error);
      toast.error('Failed to switch sessions');
    }
  }, [fetchSessions]);

  // Create a new session
  const createSession = useCallback(async () => {
    const newSessionId = crypto.randomUUID();
    setCurrentSessionId(newSessionId);
    localStorage.setItem('chat_session_id', newSessionId);
    toast.success('Created new chat session');
    return newSessionId;
  }, []);

  // Cleanup inactive sessions (older than 7 days)
  const cleanupInactiveSessions = useCallback(async () => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { error } = await supabase
        .from('messages')
        .delete()
        .lt('last_accessed', sevenDaysAgo.toISOString());

      if (error) throw error;

      toast.success('Cleaned up inactive sessions');
      await fetchSessions();
    } catch (error) {
      console.error('Error cleaning up sessions:', error);
      toast.error('Failed to cleanup sessions');
    }
  }, [fetchSessions]);

  // Update last_accessed timestamp periodically
  useEffect(() => {
    const updateLastAccessed = async () => {
      try {
        const { error } = await supabase
          .from('messages')
          .update({ last_accessed: new Date().toISOString() })
          .eq('chat_session_id', currentSessionId);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating last_accessed:', error);
      }
    };

    const interval = setInterval(updateLastAccessed, 5 * 60 * 1000); // Every 5 minutes
    return () => clearInterval(interval);
  }, [currentSessionId]);

  // Initial fetch of sessions
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    currentSessionId,
    switchSession,
    createSession,
    cleanupInactiveSessions,
    refreshSessions: fetchSessions
  };
};