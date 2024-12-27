import { useState, useEffect, useRef, useCallback } from 'react';
import { webSocketService } from '../WebSocketService';
import { logger } from '../LoggingService';
import { toast } from 'sonner';
import { ConnectionState } from '@/types/websocket';

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
    const handleStateChange = (state: ConnectionState) => {
      setIsConnected(state === 'connected');
    };

    webSocketService.setCallbacks(
      onMessage,
      handleStateChange,
      () => {} // Empty metrics update handler
    );

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