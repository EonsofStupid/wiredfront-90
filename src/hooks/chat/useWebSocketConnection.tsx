import { useCallback, useEffect, useRef } from 'react';
import { WebSocketService } from '@/services/chat/WebSocketService';
import { useWebSocketMetrics } from './websocket/useWebSocketMetrics';
import { toast } from 'sonner';

export const useWebSocketConnection = (
  sessionId: string,
  isMinimized: boolean,
  onMessage: (message: any) => void
) => {
  const { 
    metrics, 
    connectionState, 
    setConnectionState, 
    updateMetrics 
  } = useWebSocketMetrics();
  
  const wsServiceRef = useRef<WebSocketService | null>(null);

  useEffect(() => {
    if (!isMinimized && !wsServiceRef.current) {
      console.log('[useWebSocketConnection] Initializing WebSocket service');
      wsServiceRef.current = new WebSocketService(sessionId);
      
      wsServiceRef.current.setCallbacks({
        onMessage,
        onStateChange: setConnectionState,
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
  }, [sessionId, isMinimized, onMessage, setConnectionState, updateMetrics]);

  const sendMessage = useCallback((message: any): boolean => {
    if (!wsServiceRef.current) {
      toast.error('WebSocket connection not initialized');
      return false;
    }
    return wsServiceRef.current.send(message);
  }, []);

  return {
    connectionState,
    metrics,
    sendMessage,
    isConnected: connectionState === 'connected',
    reconnect: () => wsServiceRef.current?.connect(),
    ws: wsServiceRef.current?.ws
  };
};