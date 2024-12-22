import { useCallback } from 'react';
import { useWebSocketLifecycle } from './useWebSocketLifecycle';
import { useWebSocketMetrics } from './websocket/useWebSocketMetrics';
import { WEBSOCKET_URL } from '@/constants/websocket';

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

  const { connectionState, reconnect, ws, disconnect } = useWebSocketLifecycle({
    url: wsUrl,
    onMessage: handleMessage
  });

  const metrics = useWebSocketMetrics(connectionState);

  useEffect(() => {
    if (isMinimized) {
      disconnect();
    }
  }, [isMinimized, disconnect]);

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
    reconnect,
    ws
  };
};