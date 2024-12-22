import { useCallback, useEffect } from 'react';
import { useWebSocketLifecycle } from './useWebSocketLifecycle';
import { useWebSocketMetrics } from './websocket/useWebSocketMetrics';
import { WEBSOCKET_URL } from '@/constants/websocket';
import { WebSocketConfig } from '@/types/websocket';

export const useWebSocketConnection = (
  sessionId: string,
  isMinimized: boolean,
  onMessage: (message: any) => void
) => {
  const wsUrl = `${WEBSOCKET_URL}?project_id=${sessionId}`;
  
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }, [onMessage]);

  const { connectionState, connect, disconnect, ws } = useWebSocketLifecycle();
  const metrics = useWebSocketMetrics(connectionState);

  useEffect(() => {
    if (!isMinimized) {
      const config: WebSocketConfig = {
        url: wsUrl,
        onMessage: handleMessage,
        maxRetries: 5,
        initialRetryDelay: 1000,
        maxRetryDelay: 30000
      };
      connect(config);
    } else {
      disconnect();
    }
    
    return () => {
      disconnect();
    };
  }, [wsUrl, handleMessage, isMinimized, connect, disconnect]);

  return {
    connectionState,
    metrics,
    sendMessage: useCallback((message: any) => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
        return true;
      }
      return false;
    }, [ws]),
    isConnected: connectionState === 'connected',
    reconnect: useCallback(() => {
      const config: WebSocketConfig = {
        url: wsUrl,
        onMessage: handleMessage,
        maxRetries: 5,
        initialRetryDelay: 1000,
        maxRetryDelay: 30000
      };
      connect(config);
    }, [connect, wsUrl, handleMessage]),
    ws
  };
};