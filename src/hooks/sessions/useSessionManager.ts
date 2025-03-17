
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { useChatStore } from '@/components/chat/store';
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';

export interface Session {
  id: string;
  name?: string;
  last_accessed: string; 
  is_active: boolean;
  metadata?: {
    mode?: string;
    providerId?: string;
    pageContext?: string;
  };
}

export interface SessionCreateOptions {
  metadata?: {
    mode?: string;
    providerId?: string;
    pageContext?: string;
  };
}

export function useSessionManager() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setSessionLoading } = useChatStore();

  // Fetch all sessions
  const refreshSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      setSessionLoading(true);
      
      // Attempt to load from Supabase if authenticated
      const { data: user } = await supabase.auth.getUser();
      
      if (user?.user?.id) {
        const { data, error } = await supabase
          .from('chat_sessions')
          .select('*')
          .order('last_accessed', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data && data.length) {
          setSessions(data);
          
          // Set current session if none is set
          if (!currentSessionId && data.length > 0) {
            setCurrentSessionId(data[0].id);
          }
          
          return;
        }
      }
      
      // Fallback to localStorage if no Supabase data
      const storedSessions = localStorage.getItem('chat_sessions');
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions);
        setSessions(parsedSessions);
        
        if (!currentSessionId && parsedSessions.length > 0) {
          setCurrentSessionId(parsedSessions[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load chat sessions');
    } finally {
      setIsLoading(false);
      setSessionLoading(false);
    }
  }, [currentSessionId, setSessionLoading]);

  // Initialize sessions
  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  // Create a new session
  const createSession = useCallback(async (options?: SessionCreateOptions) => {
    try {
      setIsLoading(true);
      
      const newSession: Session = {
        id: uuidv4(),
        last_accessed: new Date().toISOString(),
        is_active: true,
        metadata: options?.metadata || {}
      };
      
      // Try to save to Supabase first
      const { data: user } = await supabase.auth.getUser();
      
      if (user?.user?.id) {
        const { data, error } = await supabase
          .from('chat_sessions')
          .insert({
            ...newSession,
            user_id: user.user.id
          })
          .select()
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setSessions(prevSessions => [data, ...prevSessions]);
          setCurrentSessionId(data.id);
          return data.id;
        }
      }
      
      // Fallback to localStorage
      setSessions(prevSessions => [newSession, ...prevSessions]);
      setCurrentSessionId(newSession.id);
      
      // Update localStorage
      const updatedSessions = [newSession, ...sessions];
      localStorage.setItem('chat_sessions', JSON.stringify(updatedSessions));
      
      return newSession.id;
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create new chat session');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [sessions]);

  // Switch session
  const switchSession = useCallback((sessionId: string) => {
    if (sessions.find(s => s.id === sessionId)) {
      setCurrentSessionId(sessionId);
      
      // Update last accessed
      const updatedSessions = sessions.map(session => 
        session.id === sessionId 
          ? { ...session, last_accessed: new Date().toISOString() }
          : session
      );
      
      setSessions(updatedSessions);
      localStorage.setItem('chat_sessions', JSON.stringify(updatedSessions));
      
      // If logged in, update in Supabase too
      (async () => {
        const { data: user } = await supabase.auth.getUser();
        if (user?.user?.id) {
          await supabase
            .from('chat_sessions')
            .update({ last_accessed: new Date().toISOString() })
            .eq('id', sessionId);
        }
      })();
    }
  }, [sessions]);

  // Clean up inactive sessions (older than 30 days)
  const cleanupInactiveSessions = useCallback(async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const activeSessions = sessions.filter(session => 
        new Date(session.last_accessed) > thirtyDaysAgo
      );
      
      if (activeSessions.length === sessions.length) {
        toast.info('No inactive sessions to clean up');
        return;
      }
      
      setSessions(activeSessions);
      localStorage.setItem('chat_sessions', JSON.stringify(activeSessions));
      
      // If current session was deleted, switch to the most recent one
      if (currentSessionId && !activeSessions.find(s => s.id === currentSessionId)) {
        if (activeSessions.length > 0) {
          setCurrentSessionId(activeSessions[0].id);
        } else {
          setCurrentSessionId(null);
        }
      }
      
      // If logged in, delete from Supabase too
      const { data: user } = await supabase.auth.getUser();
      if (user?.user?.id) {
        await supabase
          .from('chat_sessions')
          .delete()
          .lt('last_accessed', thirtyDaysAgo.toISOString());
      }
      
      toast.success('Inactive sessions cleaned up');
    } catch (error) {
      console.error('Error cleaning up sessions:', error);
      toast.error('Failed to clean up inactive sessions');
    }
  }, [sessions, currentSessionId]);

  // Clear all sessions
  const clearSessions = useCallback(async (preserveCurrent: boolean = false) => {
    try {
      if (preserveCurrent && !currentSessionId) {
        toast.error('No current session to preserve');
        return;
      }
      
      let newSessions: Session[] = [];
      
      if (preserveCurrent && currentSessionId) {
        newSessions = sessions.filter(s => s.id === currentSessionId);
      }
      
      setSessions(newSessions);
      localStorage.setItem('chat_sessions', JSON.stringify(newSessions));
      
      if (!preserveCurrent) {
        setCurrentSessionId(null);
      }
      
      // If logged in, delete from Supabase too
      const { data: user } = await supabase.auth.getUser();
      if (user?.user?.id) {
        if (preserveCurrent && currentSessionId) {
          await supabase
            .from('chat_sessions')
            .delete()
            .neq('id', currentSessionId);
        } else {
          await supabase
            .from('chat_sessions')
            .delete()
            .gte('id', ''); // Delete all
        }
      }
      
      toast.success(preserveCurrent ? 'All other sessions cleared' : 'All sessions cleared');
    } catch (error) {
      console.error('Error clearing sessions:', error);
      toast.error('Failed to clear sessions');
    }
  }, [sessions, currentSessionId]);

  return {
    sessions,
    currentSessionId,
    isLoading,
    refreshSessions,
    createSession,
    switchSession,
    cleanupInactiveSessions,
    clearSessions
  };
}
