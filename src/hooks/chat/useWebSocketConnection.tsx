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
  
  const updateMetrics = useCallback((metrics: Partial<ConnectionMetrics>) => {
    metricsRef.current = { ...metricsRef.current, ...metrics } as ConnectionMetrics;
    logger.debug('WebSocket metrics updated', 
      { 
        metrics: metricsRef.current,
        sessionId,
        timestamp: new Date().toISOString()
      },
      sessionId,
      { component: 'useWebSocketConnection', action: 'updateMetrics' }
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
      },
      sessionId,
      { component: 'useWebSocketConnection', action: 'updateState' }
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
        logger.debug('Chat is minimized, not initializing WebSocket',
          { sessionId, timestamp: new Date().toISOString() },
          sessionId,
          { component: 'useWebSocketConnection', action: 'initialize' }
        );
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          logger.warn('No active session found',
            { sessionId, timestamp: new Date().toISOString() },
            sessionId,
            { component: 'useWebSocketConnection', action: 'initialize' }
          );
          updateState('error');
          return;
        }

        logger.info('Initializing WebSocket connection',
          {
            sessionId,
            hasToken: !!session.access_token,
            url: WEBSOCKET_URL,
            timestamp: new Date().toISOString()
          },
          sessionId,
          { component: 'useWebSocketConnection', action: 'initialize' }
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
            { sessionId, timestamp: new Date().toISOString() },
            sessionId,
            { component: 'useWebSocketConnection', action: 'initialize' }
          );
        }
      } catch (error) {
        logger.error('Failed to initialize WebSocket',
          {
            error,
            sessionId,
            timestamp: new Date().toISOString()
          },
          sessionId,
          { component: 'useWebSocketConnection', action: 'initialize', error: error as Error }
        );
        updateState('error');
      }
    };

    initializeWebSocket();

    return () => {
      if (wsServiceRef.current) {
        logger.info('Cleaning up WebSocket service',
          { sessionId, timestamp: new Date().toISOString() },
          sessionId,
          { component: 'useWebSocketConnection', action: 'cleanup' }
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
          {
            sessionId,
            timestamp: new Date().toISOString()
          },
          sessionId,
          { component: 'useWebSocketConnection', action: 'sendMessage' }
        );
        toast.error('WebSocket connection not initialized');
        return false;
      }
      return wsServiceRef.current.send(message);
    }, [sessionId]),
    isConnected: stateRef.current === 'connected',
    reconnect: async () => {
      logger.info('Manual reconnection requested',
        { sessionId, timestamp: new Date().toISOString() },
        sessionId,
        { component: 'useWebSocketConnection', action: 'reconnect' }
      );
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token && wsServiceRef.current) {
          await wsServiceRef.current.connect(session.access_token);
        }
      } catch (error) {
        logger.error('Failed to reconnect',
          {
            error,
            sessionId,
            timestamp: new Date().toISOString()
          },
          sessionId,
          { component: 'useWebSocketConnection', action: 'reconnect', error: error as Error }
        );
        updateState('error');
      }
    },
  };
};