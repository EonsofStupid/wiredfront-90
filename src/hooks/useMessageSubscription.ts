import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Message } from '@/types/chat';
import { logger } from '@/services/chat/LoggingService';

export const useMessageSubscription = (
  sessionId: string | null,
  onNewMessage: (message: Message) => void
) => {
  useEffect(() => {
    if (!sessionId) {
      logger.warn('No session ID provided for message subscription');
      return;
    }

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
          logger.debug('Real-time message update:', payload);
          if (payload.eventType === 'INSERT') {
            onNewMessage(payload.new as Message);
          }
        }
      )
      .subscribe((status) => {
        logger.info(`Subscription status for session ${sessionId}:`, {
          status: status.toString(),
          timestamp: new Date().toISOString(),
          sessionId
        });
      });

    return () => {
      logger.info(`Unsubscribing from session ${sessionId}`);
      supabase.removeChannel(channel);
    };
  }, [sessionId, onNewMessage]);
};