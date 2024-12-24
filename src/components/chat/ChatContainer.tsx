import { useEffect, useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { logger } from '@/services/chat/LoggingService';
import { useChatStore } from '@/stores/chat/store';
import { toast } from 'sonner';

export const ChatContainer = ({ sessionId }: { sessionId: string }) => {
  const { setConnectionState } = useChatStore();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const setupRealtimeSubscription = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        logger.warn('No active session found for realtime subscription');
        setConnectionState('error');
        return null;
      }

      logger.info('Setting up realtime subscription for session:', sessionId);
      setConnectionState('connecting');

      channelRef.current = supabase
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
            logger.debug('Received realtime message update:', payload);
            
            if (payload.eventType === 'INSERT') {
              toast.success('New message received', { id: `new-message-${payload.new.id}` });
            }
          }
        )
        .subscribe((status) => {
          logger.info(`Subscription status for session ${sessionId}:`, status);
          
          if (status === 'SUBSCRIBED') {
            setConnectionState('connected');
            logger.info('Successfully subscribed to message updates');
          } else if (status === 'CHANNEL_ERROR') {
            setConnectionState('error');
            logger.error('Failed to connect to chat session');
          }
        });

      return channelRef.current;
    } catch (error) {
      logger.error('Error setting up realtime subscription:', error);
      setConnectionState('error');
      return null;
    }
  }, [sessionId, setConnectionState]);

  useEffect(() => {
    if (!sessionId) {
      logger.warn('No session ID provided for realtime subscription');
      return;
    }

    setupRealtimeSubscription();

    return () => {
      if (channelRef.current) {
        logger.info(`Cleaning up subscription for session ${sessionId}`);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setConnectionState('disconnected');
    };
  }, [sessionId, setupRealtimeSubscription, setConnectionState]);

  return null;
};