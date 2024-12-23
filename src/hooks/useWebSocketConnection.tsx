import { useCallback, useEffect, useRef } from 'react';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { supabase } from "@/integrations/supabase/client";
import { WebSocketService } from '@/services/chat/WebSocketService';
import { WEBSOCKET_URL, RECONNECT_INTERVALS } from '@/constants/websocket';
import { debounce } from 'lodash';

export const useWebSocketConnection = (
  sessionId: string,
  isMinimized: boolean,
  onMessage: (message: any) => void
) => {
  const wsServiceRef = useRef<WebSocketService | null>(null);
  const metricsRef = useRef<ConnectionMetrics | null>(null);
  const stateRef = useRef<ConnectionState>('initial');
  const reconnectAttemptRef = useRef(0);
  const isCleaningUpRef = useRef(false);
  
  const debouncedCleanup = useCallback(
    debounce(() => {
      if (wsServiceRef.current && !isCleaningUpRef.current) {
        isCleaningUpRef.current = true;
        logger.info('Cleaning up WebSocket service', {
          sessionId,
          context: 'cleanup'
        });
        wsServiceRef.current.disconnect();
        wsServiceRef.current = null;
        isCleaningUpRef.current = false;
      }
    }, 500),
    [sessionId]
  );

  useEffect(() => {
    const initializeWebSocket = async () => {
      if (isMinimized || isCleaningUpRef.current) {
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          logger.warn('No active session found', {
            sessionId,
            context: 'auth_validation'
          });
          return;
        }

        if (wsServiceRef.current) {
          await debouncedCleanup();
        }

        wsServiceRef.current = new WebSocketService(sessionId);
        
        wsServiceRef.current.setCallbacks({
          onMessage,
          onStateChange: (state: ConnectionState) => {
            if (state === stateRef.current) return;
            
            logger.info(`WebSocket state updated: ${state}`, {
              previousState: stateRef.current,
              newState: state,
              sessionId,
              context: 'state_change'
            });
            stateRef.current = state;
          },
          onMetricsUpdate: (metrics: Partial<ConnectionMetrics>) => {
            metricsRef.current = { ...metricsRef.current, ...metrics } as ConnectionMetrics;
          }
        });

        await wsServiceRef.current.connect(session.access_token);
        reconnectAttemptRef.current = 0;

      } catch (error) {
        logger.error('Failed to initialize WebSocket', {
          error,
          sessionId,
          context: 'initialization_error'
        });
        
        const delay = RECONNECT_INTERVALS[reconnectAttemptRef.current] || RECONNECT_INTERVALS[RECONNECT_INTERVALS.length - 1];
        reconnectAttemptRef.current = Math.min(reconnectAttemptRef.current + 1, RECONNECT_INTERVALS.length - 1);
        
        setTimeout(initializeWebSocket, delay);
      }
    };

    initializeWebSocket();

    return () => {
      debouncedCleanup();
    };
  }, [sessionId, isMinimized, onMessage, debouncedCleanup]);

  return {
    connectionState: stateRef.current,
    metrics: metricsRef.current,
    sendMessage: useCallback((message: any): boolean => {
      if (!wsServiceRef.current) {
        logger.error('WebSocket connection not initialized', { sessionId });
        toast.error('WebSocket connection not initialized');
        return false;
      }
      return wsServiceRef.current.send(message);
    }, [sessionId]),
    isConnected: stateRef.current === 'connected',
    reconnect: async () => {
      logger.info('Manual reconnection requested', { sessionId });
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token && wsServiceRef.current) {
          await wsServiceRef.current.connect(session.access_token);
        }
      } catch (error) {
        logger.error('Failed to reconnect', { error, sessionId });
      }
    },
  };
};