import { useCallback, useEffect, useRef } from 'react';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { supabase } from "@/integrations/supabase/client";
import { WebSocketService } from '@/services/chat/WebSocketService';
import { WEBSOCKET_URL } from '@/constants/websocket';

export const useWebSocketConnection = (
  sessionId: string,
  isMinimized: boolean,
  onMessage: (message: any) => void
) => {
  const wsServiceRef = useRef<WebSocketService | null>(null);
  const metricsRef = useRef<ConnectionMetrics | null>(null);
  const stateRef = useRef<ConnectionState>('initial');
  
  useEffect(() => {
    const initializeWebSocket = async () => {
      if (isMinimized) {
        logger.info('Chat is minimized, not initializing WebSocket',
          { 
            sessionId,
            context: 'initialization_skipped'
          }
        );
        return;
      }

      try {
        logger.info('Starting WebSocket initialization',
          {
            sessionId,
            timestamp: new Date().toISOString(),
            context: 'initialization_start'
          }
        );

        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          logger.warn('No active session found',
            {
              sessionId,
              context: 'auth_validation'
            }
          );
          return;
        }

        logger.info('Initializing WebSocket connection',
          {
            sessionId,
            hasToken: !!session.access_token,
            url: WEBSOCKET_URL,
            context: 'connection_setup'
          }
        );

        if (!wsServiceRef.current) {
          wsServiceRef.current = new WebSocketService(sessionId);
          
          wsServiceRef.current.setCallbacks({
            onMessage,
            onStateChange: (state: ConnectionState) => {
              logger.info(`WebSocket state updated: ${state}`,
                {
                  previousState: stateRef.current,
                  newState: state,
                  sessionId,
                  context: 'state_change'
                }
              );
              stateRef.current = state;
            },
            onMetricsUpdate: (metrics: Partial<ConnectionMetrics>) => {
              logger.info('WebSocket metrics updated',
                {
                  metrics,
                  sessionId,
                  context: 'metrics_update'
                }
              );
              metricsRef.current = { ...metricsRef.current, ...metrics } as ConnectionMetrics;
            }
          });

          await wsServiceRef.current.connect(session.access_token);
          
          logger.info('WebSocket service initialized and connected',
            {
              sessionId,
              context: 'initialization_complete'
            }
          );
        }
      } catch (error) {
        logger.error('Failed to initialize WebSocket',
          {
            error,
            sessionId,
            context: 'initialization_error'
          }
        );
      }
    };

    initializeWebSocket();

    return () => {
      if (wsServiceRef.current) {
        logger.info('Cleaning up WebSocket service',
          {
            sessionId,
            context: 'cleanup'
          }
        );
        wsServiceRef.current.disconnect();
        wsServiceRef.current = null;
      }
    };
  }, [sessionId, isMinimized, onMessage]);

  return {
    connectionState: stateRef.current,
    metrics: metricsRef.current,
    sendMessage: useCallback((message: any): boolean => {
      if (!wsServiceRef.current) {
        logger.error('WebSocket connection not initialized',
          { sessionId }
        );
        toast.error('WebSocket connection not initialized');
        return false;
      }
      return wsServiceRef.current.send(message);
    }, [sessionId]),
    isConnected: stateRef.current === 'connected',
    reconnect: async () => {
      logger.info('Manual reconnection requested',
        { sessionId }
      );
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token && wsServiceRef.current) {
          await wsServiceRef.current.connect(session.access_token);
        }
      } catch (error) {
        logger.error('Failed to reconnect',
          { error, sessionId }
        );
      }
    },
  };
};