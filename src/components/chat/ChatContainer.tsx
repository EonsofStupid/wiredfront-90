import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { logger } from '@/services/chat/LoggingService';
import { useChatStore } from '@/stores/chat/store';
import { toast } from 'sonner';

export const ChatContainer = ({ sessionId }: { sessionId: string }) => {
  const { setConnectionState } = useChatStore();

  useEffect(() => {
    if (!sessionId) {
      logger.warn('No session ID provided for realtime subscription');
      return;
    }

    const setupRealtimeSubscription = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          logger.warn('No active session found for realtime subscription');
          setConnectionState('error');
          return;
        }

        logger.info('Setting up realtime subscription for session:', sessionId);
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
              logger.debug('Received realtime message update:', payload);
              
              if (payload.eventType === 'INSERT') {
                toast.success('New message received');
              } else if (payload.eventType === 'UPDATE') {
                toast.info('Message updated');
              } else if (payload.eventType === 'DELETE') {
                toast.info('Message deleted');
              }
            }
          )
          .subscribe(async (status) => {
            logger.info(`Subscription status for session ${sessionId}:`, status);
            
            if (status === 'SUBSCRIBED') {
              setConnectionState('connected');
              logger.info('Successfully subscribed to message updates');
              toast.success('Connected to chat session');
            } else if (status === 'CHANNEL_ERROR') {
              setConnectionState('error');
              logger.error('Failed to connect to chat session');
              toast.error('Failed to connect to chat session');
            } else if (status === 'TIMED_OUT') {
              setConnectionState('error');
              logger.error('Connection timed out');
              toast.error('Connection timed out - trying to reconnect...');
            }
          });

        return () => {
          logger.info(`Cleaning up subscription for session ${sessionId}`);
          setConnectionState('disconnected');
          supabase.removeChannel(channel);
        };
      } catch (error) {
        logger.error('Error setting up realtime subscription:', error);
        setConnectionState('error');
        toast.error('Failed to setup chat connection');
      }
    };

    const subscription = setupRealtimeSubscription();
    
    return () => {
      subscription.then(cleanup => cleanup?.());
    };
  }, [sessionId, setConnectionState]);

  return null;
};