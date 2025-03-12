import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useMessageStore } from '@/components/chat/messaging/MessageManager';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { useChatStore } from '@/components/chat/store/chatStore';
import { Json } from '@/integrations/supabase/types';

export interface Session {
  id: string;
  title: string;
  created_at: string;
  last_accessed: string;
  message_count: number;
}

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
      
      // Get user from Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Fetch chat sessions for the current user
      const { data, error } = await supabase
        .from('chat_sessions')
        .select(`
          id,
          title,
          created_at,
          last_accessed,
          message_count
        `)
        .eq('user_id', user.id)
        .order('last_accessed', { ascending: false });

      if (error) throw error;

      // Set sessions
      setSessions(data || []);
      
      // If we have sessions but no current session, set the most recent
      if (data && data.length > 0 && !currentSessionId) {
        setCurrentSessionId(data[0].id);
        await fetchSessionMessages(data[0].id);
      }
      
      logger.info('Sessions fetched', { count: data?.length });
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load chat sessions');
      logger.error('Failed to fetch sessions', { error });
    } finally {
      setIsLoading(false);
      setSessionLoading(false);
    }
  }, [currentSessionId, fetchSessionMessages, setSessionLoading]);

  const createSession = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Get user from Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const sessionId = uuidv4();
      const now = new Date().toISOString();
      
      // Create a new session
      const { error } = await supabase
        .from('chat_sessions')
        .insert({
          id: sessionId,
          user_id: user.id,
          title: `Chat ${new Date().toLocaleString()}`,
          created_at: now,
          last_accessed: now,
          message_count: 0
        });

      if (error) throw error;

      // Switch to the new session
      setCurrentSessionId(sessionId);
      clearMessages();
      
      // Update sessions list
      await fetchSessions();
      
      toast.success('New chat session created');
      logger.info('New session created', { sessionId });
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create new chat session');
      logger.error('Failed to create session', { error });
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
      await supabase
        .from('chat_sessions')
        .update({ last_accessed: new Date().toISOString() })
        .eq('id', sessionId);
      
      logger.info('Switched to session', { sessionId });
    } catch (error) {
      console.error('Error switching session:', error);
      toast.error('Failed to switch chat session');
      logger.error('Failed to switch session', { error, sessionId });
    } finally {
      setIsLoading(false);
      setSessionLoading(false);
    }
  }, [currentSessionId, fetchSessionMessages, setSessionLoading]);

  const cleanupInactiveSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Get user from Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Keep current session and the 5 most recently updated sessions
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('id, last_accessed')
        .eq('user_id', user.id)
        .order('last_accessed', { ascending: false });

      if (error) throw error;

      // Keep the current session and the 5 most recent ones
      const sessionsToKeep = new Set<string>([
        currentSessionId!, 
        ...data.slice(0, 5).map(s => s.id)
      ]);
      
      const sessionsToDelete = data
        .filter(s => !sessionsToKeep.has(s.id))
        .map(s => s.id);

      if (sessionsToDelete.length === 0) {
        toast.info('No inactive sessions to clean up');
        return;
      }

      // Delete inactive sessions
      const { error: deleteError } = await supabase
        .from('chat_sessions')
        .delete()
        .in('id', sessionsToDelete);

      if (deleteError) throw deleteError;

      // Refresh sessions list
      await fetchSessions();
      
      toast.success(`Cleaned up ${sessionsToDelete.length} inactive sessions`);
      logger.info('Cleaned up inactive sessions', { count: sessionsToDelete.length });
    } catch (error) {
      console.error('Error cleaning up sessions:', error);
      toast.error('Failed to clean up inactive sessions');
      logger.error('Failed to clean up sessions', { error });
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
