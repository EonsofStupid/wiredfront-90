import { useCallback, useEffect } from 'react';
import { useWebSocketLifecycle } from './useWebSocketLifecycle';
import { useWebSocketMetrics } from './websocket/useWebSocketMetrics';
import { WEBSOCKET_URL } from '@/constants/websocket';
import { toast } from 'sonner';

export const useWebSocketConnection = (
  sessionId: string,
  isMinimized: boolean,
  onMessage: (message: any) => void
) => {
  const wsUrl = `${WEBSOCKET_URL}?project_id=${sessionId}`;
  
  const { 
    metrics, 
    connectionState, 
    setConnectionState, 
    updateMetrics 
  } = useWebSocketMetrics();
  
  const { wsRef, setupWebSocketHandlers } = useWebSocketLifecycle(
    wsUrl,
    setConnectionState,
    updateMetrics
  );

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);
      onMessage(data);
      updateMetrics({ messagesReceived: metrics.messagesReceived + 1 });
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
      toast.error('Failed to process message');
    }
  }, [onMessage, updateMetrics, metrics.messagesReceived]);

  useEffect(() => {
    if (!isMinimized) {
      const ws = new WebSocket(wsUrl);
      wsRef.current = setupWebSocketHandlers(ws, handleMessage);
    }
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [wsUrl, isMinimized, setupWebSocketHandlers, handleMessage]);

  const sendMessage = useCallback((message: any): boolean => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(message));
        updateMetrics({ messagesSent: metrics.messagesSent + 1 });
        return true;
      } catch (error) {
        console.error('Failed to send message:', error);
        toast.error('Failed to send message');
        return false;
      }
    }
    return false;
  }, [updateMetrics, metrics.messagesSent]);

  return {
    connectionState,
    metrics,
    sendMessage,
    isConnected: connectionState === 'connected',
    reconnect: () => {
      if (wsRef.current) {
        wsRef.current.close();
        const ws = new WebSocket(wsUrl);
        wsRef.current = setupWebSocketHandlers(ws, handleMessage);
      }
    },
    ws: wsRef.current
  };
};