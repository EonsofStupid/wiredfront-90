import { useCallback, useEffect, useRef } from 'react';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from '@/stores/auth/store';
import { WebSocketService } from '@/services/chat/WebSocketService';

export const useWebSocketConnection = (
  sessionId: string,
  isMinimized: boolean,
  onMessage: (message: any) => void
) => {
  const wsServiceRef = useRef<WebSocketService | null>(null);
  const metricsRef = useRef<ConnectionMetrics | null>(null);
  const stateRef = useRef<ConnectionState>('initial');
  const { isAuthenticated } = useAuthStore();

  const updateMetrics = useCallback((metrics: Partial<ConnectionMetrics>) => {
    metricsRef.current = { ...metricsRef.current, ...metrics } as ConnectionMetrics;
    logger.debug('WebSocket metrics updated', metricsRef.current);
  }, []);

  const updateState = useCallback((state: ConnectionState) => {
    stateRef.current = state;
    logger.info(`WebSocket state updated: ${state}`);
    
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
  }, []);

  useEffect(() => {
    const initializeWebSocket = async () => {
      if (isMinimized || !isAuthenticated) return;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          logger.warn('No active session found');
          updateState('error');
          return;
        }

        if (!wsServiceRef.current) {
          logger.info('Initializing WebSocket service', { sessionId });
          wsServiceRef.current = new WebSocketService(sessionId);
          
          await wsServiceRef.current.setCallbacks({
            onMessage,
            onStateChange: updateState,
            onMetricsUpdate: updateMetrics
          });

          await wsServiceRef.current.connect(session.access_token);
        }
      } catch (error) {
        logger.error('Failed to initialize WebSocket', { error });
        updateState('error');
      }
    };

    initializeWebSocket();

    return () => {
      if (wsServiceRef.current) {
        logger.info('Cleaning up WebSocket service');
        wsServiceRef.current.disconnect();
        wsServiceRef.current = null;
      }
    };
  }, [sessionId, isMinimized, onMessage, updateState, updateMetrics, isAuthenticated]);

  return {
    connectionState: stateRef.current,
    metrics: metricsRef.current,
    sendMessage: useCallback((message: any): boolean => {
      if (!wsServiceRef.current) {
        logger.error('WebSocket connection not initialized');
        toast.error('WebSocket connection not initialized');
        return false;
      }
      return wsServiceRef.current.send(message);
    }, []),
    isConnected: stateRef.current === 'connected',
    reconnect: async () => {
      logger.info('Manual reconnection requested');
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token && wsServiceRef.current) {
          await wsServiceRef.current.connect(session.access_token);
        }
      } catch (error) {
        logger.error('Failed to reconnect', { error });
        updateState('error');
      }
    },
  };
};