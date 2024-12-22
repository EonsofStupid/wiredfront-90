import { useCallback, useEffect } from 'react';
import { useWebSocketLifecycle } from './useWebSocketLifecycle';
import { useWebSocketMetrics } from './websocket/useWebSocketMetrics';
import { WEBSOCKET_URL } from '@/constants/websocket';
import { WebSocketConfig } from '@/types/websocket';
import { toast } from 'sonner';

export const useWebSocketConnection = (
  sessionId: string,
  isMinimized: boolean,
  onMessage: (message: any) => void
) => {
  const wsUrl = `${WEBSOCKET_URL}?project_id=${sessionId}`;
  
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);
      onMessage(data);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
      toast.error('Failed to process message');
    }
  }, [onMessage]);

  const { connectionState, metrics, updateMetrics, setConnectionState } = useWebSocketMetrics();
  
  const { wsRef, connect, cleanup, messageQueueRef } = useWebSocketLifecycle(
    wsUrl,
    setConnectionState,
    updateMetrics
  );

  useEffect(() => {
    if (!isMinimized) {
      connect();
    } else {
      cleanup();
    }
    
    return () => {
      cleanup();
    };
  }, [wsUrl, isMinimized, connect, cleanup]);

  const sendMessage = useCallback((message: any): boolean => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(message));
        updateMetrics({ messagesSent: prev => (prev || 0) + 1 });
        return true;
      } catch (error) {
        console.error('Failed to send message:', error);
        toast.error('Failed to send message');
        return false;
      }
    }

    // Queue message if socket isn't open
    messageQueueRef.current.add(message);
    toast.info('Message queued for sending');
    return false;
  }, [wsRef, updateMetrics, messageQueueRef]);

  return {
    connectionState,
    metrics,
    sendMessage,
    isConnected: connectionState === 'connected',
    reconnect: connect,
    ws: wsRef.current
  };
};