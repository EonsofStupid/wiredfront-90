import { useEffect, useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { logger } from '@/services/chat/LoggingService';
import { useChatStore } from '@/stores/chat/store';
import { toast } from 'sonner';

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY = 2000;

export const ChatContainer = ({ sessionId }: { sessionId: string }) => {
  const { setConnectionState } = useChatStore();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

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

      // Clear any existing channel
      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current);
      }

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
        .subscribe(async (status) => {
          logger.info(`Subscription status for session ${sessionId}:`, status);
          
          if (status === 'SUBSCRIBED') {
            reconnectAttemptsRef.current = 0;
            setConnectionState('connected');
            logger.info('Successfully subscribed to message updates');
          } else if (status === 'CHANNEL_ERROR') {
            logger.error('Channel error occurred');
            await handleReconnect();
          }
        });

      return channelRef.current;
    } catch (error) {
      logger.error('Error setting up realtime subscription:', error);
      await handleReconnect();
      return null;
    }
  }, [sessionId, setConnectionState]);

  const handleReconnect = async () => {
    if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      setConnectionState('error');
      toast.error('Unable to connect to chat. Please try again later.');
      return;
    }

    reconnectAttemptsRef.current++;
    setConnectionState('reconnecting');

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    reconnectTimeoutRef.current = setTimeout(() => {
      setupRealtimeSubscription();
    }, RECONNECT_DELAY * reconnectAttemptsRef.current);
  };

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
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      setConnectionState('disconnected');
    };
  }, [sessionId, setupRealtimeSubscription, setConnectionState]);

  return null;
};