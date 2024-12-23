import { useCallback, useEffect, useRef } from 'react';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { supabase } from "@/integrations/supabase/client";
import { WebSocketService } from '@/services/chat/WebSocketService';
import { WEBSOCKET_URL } from '@/constants/websocket';

/**
 * Hook for managing WebSocket connections in chat functionality
 * Handles connection lifecycle, authentication, and message handling
 */
export const useWebSocketConnection = (
  sessionId: string,
  isMinimized: boolean,
  onMessage: (message: any) => void
) => {
  const wsServiceRef = useRef<WebSocketService | null>(null);
  const metricsRef = useRef<ConnectionMetrics | null>(null);
  const stateRef = useRef<ConnectionState>('initial');
  
  const updateMetrics = useCallback((metrics: Partial<ConnectionMetrics>) => {
    metricsRef.current = { ...metricsRef.current, ...metrics } as ConnectionMetrics;
    logger.info('WebSocket metrics updated', 
      { 
        metrics: metricsRef.current,
        sessionId,
        timestamp: new Date().toISOString()
      }
    );
  }, [sessionId]);

  const updateState = useCallback((state: ConnectionState) => {
    stateRef.current = state;
    logger.info(`WebSocket state updated: ${state}`,
      {
        previousState: stateRef.current,
        newState: state,
        sessionId,
        timestamp: new Date().toISOString()
      }
    );
    
    switch (state) {
      case 'connected':
        toast.success('Connected to chat service');
        break;
      case 'disconnected':
        toast.error('Disconnected from chat service');
        break;
      case 'reconnecting':
        toast.info('Attempting to reconnect...');
        break;
      case 'error':
        toast.error('Connection error occurred');
        break;
    }
  }, [sessionId]);

  useEffect(() => {
    const initializeWebSocket = async () => {
      if (isMinimized) {
        logger.info('Chat is minimized, not initializing WebSocket',
          { sessionId }
        );
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          logger.warn('No active session found',
            { sessionId }
          );
          updateState('error');
          return;
        }

        logger.info('Initializing WebSocket connection',
          {
            sessionId,
            hasToken: !!session.access_token,
            url: WEBSOCKET_URL
          }
        );

        if (!wsServiceRef.current) {
          wsServiceRef.current = new WebSocketService(sessionId);
          
          await wsServiceRef.current.setCallbacks({
            onMessage,
            onStateChange: updateState,
            onMetricsUpdate: updateMetrics
          });

          await wsServiceRef.current.connect(session.access_token);
          
          logger.info('WebSocket service initialized and connected',
            { sessionId }
          );
        }
      } catch (error) {
        logger.error('Failed to initialize WebSocket',
          {
            error,
            sessionId
          }
        );
        updateState('error');
      }
    };

    initializeWebSocket();

    return () => {
      if (wsServiceRef.current) {
        logger.info('Cleaning up WebSocket service',
          { sessionId }
        );
        wsServiceRef.current.disconnect();
        wsServiceRef.current = null;
      }
    };
  }, [sessionId, isMinimized, onMessage, updateState, updateMetrics]);

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
        updateState('error');
      }
    },
  };
};