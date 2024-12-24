import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { logger } from '@/services/chat/LoggingService';
import { useChatStore } from '@/stores/chat/store';
import { toast } from 'sonner';

export const ChatContainer = ({ sessionId }: { sessionId: string }) => {
  const { setConnectionState } = useChatStore();

  useEffect(() => {
    if (!sessionId) return;

    const setupRealtimeSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        logger.warn('No active session found for realtime subscription');
        setConnectionState('error');
        return;
      }

      setConnectionState('connecting');

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
            logger.debug('Real-time message update:', { payload, sessionId });
            
            // Handle different types of changes
            if (payload.eventType === 'INSERT') {
              toast.success('New message received');
            } else if (payload.eventType === 'UPDATE') {
              toast.info('Message updated');
            } else if (payload.eventType === 'DELETE') {
              toast.info('Message deleted');
            }
          }
        )
        .subscribe((status) => {
          logger.info(`Subscription status for session ${sessionId}:`, { status });
          if (status === 'SUBSCRIBED') {
            setConnectionState('connected');
            logger.info('Successfully subscribed to message updates');
            toast.success('Connected to chat session');
          } else if (status === 'CHANNEL_ERROR') {
            setConnectionState('error');
            logger.error('Failed to connect to chat session');
            toast.error('Failed to connect to chat session');
          }
        });

      return () => {
        logger.info(`Unsubscribing from session ${sessionId}`);
        setConnectionState('disconnected');
        supabase.removeChannel(channel);
      };
    };

    setupRealtimeSubscription();
  }, [sessionId, setConnectionState]);

  return null;
};