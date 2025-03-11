
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useMessageStore } from '@/components/chat/store/messageStore';

interface SessionState {
  id: string;
  lastAccessed: Date;
  isActive: boolean;
}

export const useSessionManager = () => {
  const [sessions, setSessions] = useState<SessionState[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
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
      return formattedSessions;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to fetch chat sessions');
      return [];
    }
  }, []);

  // Create a new session only if no active session exists
  const createSession = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Check for existing active session first
      const { data: existingSession } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('last_accessed', { ascending: false })
        .limit(1)
        .single();

      if (existingSession) {
        setCurrentSessionId(existingSession.id);
        return existingSession.id;
      }

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
      toast.success('New chat session created', {
        className: 'bg-gradient-to-r from-[#8B5CF6]/10 to-[#0EA5E9]/10'
      });
      return data.id;
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create new chat session');
      return null;
    }
  }, [fetchSessions, clearMessages]);

  // Initialize session only once on component mount
  useEffect(() => {
    const initializeSession = async () => {
      if (!isInitializing) return;

      const existingSessions = await fetchSessions();
      
      if (existingSessions.length === 0 || !currentSessionId) {
        await createSession();
      }
      
      setIsInitializing(false);
    };

    initializeSession();
  }, [isInitializing, fetchSessions, createSession, currentSessionId]);

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

  // Update last_accessed timestamp less frequently
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
