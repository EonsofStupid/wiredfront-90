import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { logger } from '@/services/chat/LoggingService';
import { useChatStore } from '@/stores/chat/store';

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
          }
        )
        .subscribe((status) => {
          logger.info(`Subscription status for session ${sessionId}:`, { status });
          if (status === 'SUBSCRIBED') {
            setConnectionState('connected');
            logger.info('Successfully subscribed to message updates');
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