
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/auth';
import { Session } from '@/types/sessions';
import { useChatStore } from '@/components/chat/store/chatStore';
import { toast } from 'sonner';
import { cleanupSessions } from '@/services/sessions/sessionDelete';

export function useSessionManager() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { setSessionLoading } = useChatStore();
  
  // Fetch sessions from Supabase
  const fetchSessions = useCallback(async () => {
    if (!user) return [];
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('last_accessed', { ascending: false });
      
      if (error) {
        console.error('Error fetching sessions:', error);
        toast.error('Failed to load chat sessions');
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in fetchSessions:', error);
      toast.error('Failed to load chat sessions');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Refresh sessions list
  const refreshSessions = useCallback(async () => {
    if (!user) return;
    
    try {
      setSessionLoading(true);
      const data = await fetchSessions();
      setSessions(data as Session[]);
      
      // Set current session to the most recent one if none is selected
      if (data.length > 0 && !currentSessionId) {
        setCurrentSessionId(data[0].id);
      }
    } catch (error) {
      console.error('Error refreshing sessions:', error);
    } finally {
      setSessionLoading(false);
    }
  }, [fetchSessions, user, currentSessionId, setSessionLoading]);
  
  // Create a new session
  const createSession = useCallback(async (mode = 'chat', title = 'New Chat') => {
    if (!user) {
      toast.error('You must be logged in to create a session');
      return null;
    }
    
    try {
      setSessionLoading(true);
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: title,
          mode: mode,
          is_active: true,
          last_accessed: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating session:', error);
        toast.error('Failed to create new chat session');
        return null;
      }
      
      // Update sessions list
      setSessions(prevSessions => [data, ...prevSessions] as Session[]);
      setCurrentSessionId(data.id);
      
      toast.success('Created new chat session');
      return data.id;
    } catch (error) {
      console.error('Error in createSession:', error);
      toast.error('Failed to create new chat session');
      return null;
    } finally {
      setSessionLoading(false);
    }
  }, [user, setSessionLoading]);
  
  // Switch to a different session
  const switchSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
    
    // Update last_accessed timestamp
    supabase
      .from('chat_sessions')
      .update({ last_accessed: new Date().toISOString() })
      .eq('id', sessionId)
      .then(({ error }) => {
        if (error) {
          console.error('Error updating session last_accessed:', error);
        }
      });
  }, []);
  
  // Clean up old sessions
  const performCleanup = useCallback(async () => {
    if (!currentSessionId) return;
    
    try {
      await cleanupSessions(currentSessionId);
      refreshSessions();
    } catch (error) {
      console.error('Error cleaning up sessions:', error);
    }
  }, [currentSessionId, refreshSessions]);
  
  // Initialize
  useEffect(() => {
    if (user) {
      refreshSessions();
    }
  }, [user, refreshSessions]);
  
  return {
    sessions,
    currentSessionId,
    isLoading,
    refreshSessions,
    createSession,
    switchSession,
    performCleanup,
  };
}
