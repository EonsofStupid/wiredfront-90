import { useState, useEffect, useCallback } from 'react';
import { webSocketService } from '../WebSocketService';
import { logger } from '../LoggingService';
import { toast } from 'sonner';
import { ConnectionState } from '@/types/websocket';
import { useSessionStore } from '@/stores/session/store';

export const useWebSocketConnection = (onMessage: (content: string) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const user = useSessionStore((state) => state.user);

  const sendMessage = useCallback(async (message: any) => {
    try {
      if (!user) {
        toast.error('Please sign in to send messages');
        return;
      }

      if (!isConnected) {
        await webSocketService.connect();
      }
      
      const success = webSocketService.send(message);
      if (!success) {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      logger.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
      throw error;
    }
  }, [isConnected, user]);

  useEffect(() => {
    const handleStateChange = (state: ConnectionState) => {
      setIsConnected(state === 'connected');
    };

    const handleMetricsUpdate = (metrics: any) => {
      logger.debug('WebSocket metrics updated:', metrics);
    };

    webSocketService.setCallbacks(
      onMessage,
      handleStateChange,
      handleMetricsUpdate
    );

    if (user) {
      webSocketService.connect();
    }

    return () => {
      webSocketService.disconnect();
    };
  }, [onMessage, user]);

  return {
    isConnected,
    sendMessage
  };
};