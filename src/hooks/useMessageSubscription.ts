
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Message } from '@/components/chat/types';
import { logger } from '@/services/chat/LoggingService';

export const useMessageSubscription = (
  conversationId: string | null,
  onNewMessage: (message: Message) => void
) => {
  useEffect(() => {
    if (!conversationId) {
      logger.warn('No conversation ID provided for message subscription');
      return;
    }

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          logger.debug('Real-time message update:', payload);
          if (payload.eventType === 'INSERT') {
            onNewMessage(payload.new as Message);
          }
        }
      )
      .subscribe((status) => {
        logger.info(`Subscription status for conversation ${conversationId}:`, {
          status: status.toString(),
          timestamp: new Date().toISOString(),
          conversationId
        });
      });

    return () => {
      logger.info(`Unsubscribing from conversation ${conversationId}`);
      supabase.removeChannel(channel);
    };
  }, [conversationId, onNewMessage]);
};
