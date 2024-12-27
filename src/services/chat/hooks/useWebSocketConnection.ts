import { useState, useEffect, useRef, useCallback } from 'react';
import { webSocketService } from '../WebSocketService';
import { logger } from '../LoggingService';
import { toast } from 'sonner';

export const useWebSocketConnection = (onMessage: (content: string) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const sendMessage = useCallback(async (message: any) => {
    try {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        await webSocketService.connect();
      }
      webSocketService.send(message);
    } catch (error) {
      logger.error('Failed to send message:', error);
      toast.error('Failed to send message');
      throw error;
    }
  }, []);

  useEffect(() => {
    webSocketService.setCallbacks({
      onMessage,
      onStateChange: (state) => setIsConnected(state === 'connected'),
      onMetricsUpdate: () => {}
    });

    webSocketService.connect();

    return () => {
      webSocketService.disconnect();
    };
  }, [onMessage]);

  return {
    isConnected,
    sendMessage
  };
};