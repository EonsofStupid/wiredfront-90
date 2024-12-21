import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Message = Database['public']['Tables']['messages']['Row'];

interface UseMessageSubscriptionProps {
  sessionId: string;
  isMinimized: boolean;
  limit?: number;
}

export const useMessageSubscription = ({ 
  sessionId, 
  isMinimized, 
  limit = 50 
}: UseMessageSubscriptionProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_session_id', sessionId)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch messages');
        console.error('Error fetching messages:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId && !isMinimized) {
      fetchMessages();
    }
  }, [sessionId, limit, isMinimized]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!sessionId || isMinimized) return;

    const channel = supabase
      .channel(`messages:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `chat_session_id=eq.${sessionId}`,
        },
        (payload) => {
          console.log('Real-time message update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setMessages((prev) => [payload.new as Message, ...prev].slice(0, limit));
          } else if (payload.eventType === 'UPDATE') {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === payload.new.id ? (payload.new as Message) : msg
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for session ${sessionId}:`, status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to message updates');
        }
      });

    return () => {
      console.log(`Unsubscribing from session ${sessionId}`);
      supabase.removeChannel(channel);
    };
  }, [sessionId, isMinimized, limit]);

  return {
    messages,
    isLoading,
    error,
  };
};