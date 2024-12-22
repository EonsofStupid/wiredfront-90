import { useCallback, useEffect, useRef } from 'react';
import { WebSocketService } from '@/services/chat/WebSocketService';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { toast } from 'sonner';

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
  }, []);

  const updateState = useCallback((state: ConnectionState) => {
    stateRef.current = state;
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
    if (!isMinimized && !wsServiceRef.current) {
      console.log('[useWebSocketConnection] Initializing WebSocket service');
      wsServiceRef.current = new WebSocketService(sessionId);
      
      wsServiceRef.current.setCallbacks({
        onMessage,
        onStateChange: updateState,
        onMetricsUpdate: updateMetrics
      });

      wsServiceRef.current.connect();
    }

    return () => {
      if (wsServiceRef.current) {
        console.log('[useWebSocketConnection] Cleaning up WebSocket service');
        wsServiceRef.current.disconnect();
        wsServiceRef.current = null;
      }
    };
  }, [sessionId, isMinimized, onMessage, updateState, updateMetrics]);

  const sendMessage = useCallback((message: any): boolean => {
    if (!wsServiceRef.current) {
      toast.error('WebSocket connection not initialized');
      return false;
    }
    return wsServiceRef.current.send(message);
  }, []);

  return {
    connectionState: stateRef.current,
    metrics: metricsRef.current,
    sendMessage,
    isConnected: stateRef.current === 'connected',
    reconnect: () => wsServiceRef.current?.connect(),
  };
};