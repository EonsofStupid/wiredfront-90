
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useMessageStore } from '@/components/chat/messaging/MessageManager';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface SessionState {
  id: string;
  lastAccessed: Date;
  isActive: boolean;
}

export const useSessionManager = () => {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const { clearMessages } = useMessageStore();
  const queryClient = useQueryClient();

  // Fetch active sessions with useQuery
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['chat_sessions'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('chat_sessions')
          .select('*')
          .order('last_accessed', { ascending: false })
          .limit(10);

        if (error) throw error;

        return data.map(session => ({
          id: session.id,
          lastAccessed: new Date(session.last_accessed),
          isActive: session.is_active
        }));
      } catch (error) {
        console.error('Error fetching sessions:', error);
        toast.error('Failed to fetch chat sessions');
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: async () => {
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
        
        return data.id;
      } catch (error) {
        console.error('Error creating session:', error);
        throw error;
      }
    },
    onSuccess: (sessionId) => {
      setCurrentSessionId(sessionId);
      clearMessages();
      queryClient.invalidateQueries({ queryKey: ['chat_sessions'] });
      toast.success('Chat session ready', {
        className: 'bg-gradient-to-r from-[#8B5CF6]/10 to-[#0EA5E9]/10'
      });
    },
    onError: () => {
      toast.error('Failed to create new chat session');
    }
  });

  // Switch session mutation
  const switchSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ last_accessed: new Date().toISOString() })
        .eq('id', sessionId);

      if (error) throw error;
      return sessionId;
    },
    onSuccess: (sessionId) => {
      setCurrentSessionId(sessionId);
      clearMessages();
      queryClient.invalidateQueries({ queryKey: ['chat_sessions'] });
      toast.success('Switched chat session');
    },
    onError: () => {
      toast.error('Failed to switch chat session');
    }
  });

  // Cleanup inactive sessions mutation
  const cleanupSessionsMutation = useMutation({
    mutationFn: async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .lt('last_accessed', sevenDaysAgo.toISOString());

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat_sessions'] });
      toast.success('Cleaned up inactive sessions');
    },
    onError: () => {
      toast.error('Failed to cleanup sessions');
    }
  });

  // Initialize session only once on component mount
  useEffect(() => {
    const initializeSession = async () => {
      if (!isInitializing) return;

      if (sessions.length === 0 || !currentSessionId) {
        await createSessionMutation.mutateAsync();
      }
      
      setIsInitializing(false);
    };

    if (!isLoading) {
      initializeSession();
    }
  }, [isInitializing, isLoading, sessions, currentSessionId, createSessionMutation]);

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
    switchSession: switchSessionMutation.mutate,
    createSession: () => createSessionMutation.mutate(),
    cleanupInactiveSessions: () => cleanupSessionsMutation.mutate(),
    isLoading: isLoading || createSessionMutation.isPending || isInitializing
  };
};
