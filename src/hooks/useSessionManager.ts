
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useMessageStore } from '@/components/chat/messaging/MessageManager';

interface SessionState {
  id: string;
  lastAccessed: Date;
  isActive: boolean;
}

export const useSessionManager = () => {
  const [sessions, setSessions] = useState<SessionState[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const { clearMessages } = useMessageStore();

  // Fetch active sessions
  const fetchSessions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('last_accessed', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formattedSessions = data.map(session => ({
        id: session.id,
        lastAccessed: new Date(session.last_accessed),
        isActive: session.is_active
      }));

      setSessions(formattedSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to fetch chat sessions');
    }
  }, []);

  // Create a new session
  const createSession = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          is_active: true,
          last_accessed: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentSessionId(data.id);
      await fetchSessions();
      clearMessages();
      toast.success('New chat session created');
      return data.id;
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create new chat session');
      return null;
    }
  }, [fetchSessions, clearMessages]);

  // Switch to a different session
  const switchSession = useCallback(async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ last_accessed: new Date().toISOString() })
        .eq('id', sessionId);

      if (error) throw error;

      setCurrentSessionId(sessionId);
      clearMessages();
      await fetchSessions();
      toast.success('Switched chat session');
    } catch (error) {
      console.error('Error switching sessions:', error);
      toast.error('Failed to switch chat session');
    }
  }, [fetchSessions, clearMessages]);

  // Cleanup inactive sessions (older than 7 days)
  const cleanupInactiveSessions = useCallback(async () => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .lt('last_accessed', sevenDaysAgo.toISOString());

      if (error) throw error;

      await fetchSessions();
      toast.success('Cleaned up inactive sessions');
    } catch (error) {
      console.error('Error cleaning up sessions:', error);
      toast.error('Failed to cleanup sessions');
    }
  }, [fetchSessions]);

  // Initialize session on component mount
  useEffect(() => {
    const initializeSession = async () => {
      await fetchSessions();
      if (!currentSessionId) {
        await createSession();
      }
    };

    initializeSession();
  }, [fetchSessions, createSession, currentSessionId]);

  // Update last_accessed timestamp periodically
  useEffect(() => {
    const updateLastAccessed = async () => {
      if (!currentSessionId) return;

      try {
        await supabase
          .from('chat_sessions')
          .update({ last_accessed: new Date().toISOString() })
          .eq('id', currentSessionId);
      } catch (error) {
        console.error('Error updating last_accessed:', error);
      }
    };

    const interval = setInterval(updateLastAccessed, 5 * 60 * 1000); // Every 5 minutes
    return () => clearInterval(interval);
  }, [currentSessionId]);

  return {
    sessions,
    currentSessionId,
    switchSession,
    createSession,
    cleanupInactiveSessions,
    refreshSessions: fetchSessions
  };
};
