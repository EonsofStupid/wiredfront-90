import { useCallback, useEffect, useRef } from 'react';
import { ConnectionState } from '@/types/websocket';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { WebSocketService } from '@/services/chat/WebSocketService';

export const useWebSocketConnection = (
  sessionId: string,
  isMinimized: boolean,
  onMessage: (message: any) => void
) => {
  const wsServiceRef = useRef<WebSocketService | null>(null);
  const stateRef = useRef<ConnectionState>('initial');
  
  useEffect(() => {
    const initializeWebSocket = async () => {
      if (isMinimized) {
        return;
      }

      try {
        if (wsServiceRef.current) {
          wsServiceRef.current.disconnect();
          wsServiceRef.current = null;
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
          }
        });

        await wsServiceRef.current.connect();

      } catch (error) {
        logger.error('Failed to initialize WebSocket', {
          error,
          sessionId,
          context: 'initialization_error'
        });
      }
    };

    initializeWebSocket();

    return () => {
      if (wsServiceRef.current) {
        wsServiceRef.current.disconnect();
        wsServiceRef.current = null;
      }
    };
  }, [sessionId, isMinimized, onMessage]);

  return {
    connectionState: stateRef.current,
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
        if (wsServiceRef.current) {
          await wsServiceRef.current.connect();
        }
      } catch (error) {
        logger.error('Failed to reconnect', { error, sessionId });
      }
    },
  };
};