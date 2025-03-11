
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { ChatSession } from '../types';

export const useSessionManager = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch active sessions
  const fetchSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('last_accessed', { ascending: false })
        .limit(10);

      if (error) throw error;

      setSessions(data as ChatSession[]);
      return data as ChatSession[];
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to fetch chat sessions');
      toast.error('Failed to fetch chat sessions');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new session
  const createSession = useCallback(async (title?: string) => {
    try {
      setIsLoading(true);
      setError(null);

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

      const sessionId = uuidv4();
      const { error } = await supabase
        .from('chat_sessions')
        .insert({
          id: sessionId,
          user_id: user.id,
          is_active: true,
          title: title || 'New Chat',
          last_accessed: new Date().toISOString()
        });

      if (error) throw error;

      setCurrentSessionId(sessionId);
      await fetchSessions();
      
      toast.success('New chat session created', {
        className: 'bg-gradient-to-r from-[#8B5CF6]/10 to-[#0EA5E9]/10'
      });
      
      return sessionId;
    } catch (error) {
      console.error('Error creating session:', error);
      setError('Failed to create new chat session');
      toast.error('Failed to create new chat session');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchSessions]);

  // Initialize session
  useEffect(() => {
    const initializeSession = async () => {
      if (!isInitializing) return;

      const existingSessions = await fetchSessions();
      
      // Find active session
      const activeSession = existingSessions.find(session => session.is_active);
      
      if (activeSession) {
        setCurrentSessionId(activeSession.id);
      } else if (existingSessions.length > 0) {
        setCurrentSessionId(existingSessions[0].id);
      } else {
        await createSession('Initial Chat');
      }
      
      setIsInitializing(false);
    };

    initializeSession();
  }, [isInitializing, fetchSessions, createSession]);

  // Switch to a different session
  const switchSession = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('chat_sessions')
        .update({ 
          last_accessed: new Date().toISOString(),
          is_active: true
        })
        .eq('id', sessionId);

      if (error) throw error;

      // Set all other sessions as inactive
      await supabase
        .from('chat_sessions')
        .update({ is_active: false })
        .neq('id', sessionId);

      setCurrentSessionId(sessionId);
      await fetchSessions();
      toast.success('Switched chat session');
    } catch (error) {
      console.error('Error switching sessions:', error);
      setError('Failed to switch chat session');
      toast.error('Failed to switch chat session');
    } finally {
      setIsLoading(false);
    }
  }, [fetchSessions]);

  // Update session title
  const updateSessionTitle = useCallback(async (sessionId: string, title: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('chat_sessions')
        .update({ title })
        .eq('id', sessionId);

      if (error) throw error;

      await fetchSessions();
      toast.success('Session title updated');
    } catch (error) {
      console.error('Error updating session title:', error);
      setError('Failed to update session title');
      toast.error('Failed to update session title');
    } finally {
      setIsLoading(false);
    }
  }, [fetchSessions]);

  // Delete a session
  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      // If current session was deleted, switch to another one
      if (sessionId === currentSessionId) {
        const remainingSessions = sessions.filter(s => s.id !== sessionId);
        if (remainingSessions.length > 0) {
          await switchSession(remainingSessions[0].id);
        } else {
          await createSession('New Chat');
        }
      }

      await fetchSessions();
      toast.success('Chat session deleted');
    } catch (error) {
      console.error('Error deleting session:', error);
      setError('Failed to delete chat session');
      toast.error('Failed to delete chat session');
    } finally {
      setIsLoading(false);
    }
  }, [fetchSessions, currentSessionId, sessions, switchSession, createSession]);

  // Cleanup inactive sessions (older than specified days)
  const cleanupInactiveSessions = useCallback(async (days = 7) => {
    try {
      setIsLoading(true);
      setError(null);

      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);

      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .lt('last_accessed', daysAgo.toISOString());

      if (error) throw error;

      await fetchSessions();
      toast.success(`Cleaned up inactive sessions older than ${days} days`);
    } catch (error) {
      console.error('Error cleaning up sessions:', error);
      setError('Failed to cleanup sessions');
      toast.error('Failed to cleanup sessions');
    } finally {
      setIsLoading(false);
    }
  }, [fetchSessions]);

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
    isLoading,
    error,
    isInitializing,
    switchSession,
    createSession,
    updateSessionTitle,
    deleteSession,
    cleanupInactiveSessions,
    refreshSessions: fetchSessions
  };
};
