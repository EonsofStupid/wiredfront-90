import { useState, useEffect, useCallback } from 'react';
import { webSocketService } from '@/services/chat/WebSocketService';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { ConnectionState } from '@/types/websocket';

export const useWebSocketConnection = (onMessage: (content: string) => void) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleStateChange = (state: ConnectionState) => {
      setIsConnected(state === 'connected');
      
      switch (state) {
        case 'connected':
          toast.success('Connected to chat service');
          break;
        case 'disconnected':
          toast.error('Disconnected from chat service');
          break;
        case 'error':
          toast.error('Connection error occurred');
          break;
      }
    };

    webSocketService.setCallbacks(onMessage, handleStateChange);
    webSocketService.connect();

    return () => {
      webSocketService.disconnect();
    };
  }, [onMessage]);

  const sendMessage = useCallback(async (message: any) => {
    if (!isConnected) {
      toast.error('Not connected to chat service');
      return false;
    }
    
    return webSocketService.send(message);
  }, [isConnected]);

  return { isConnected, sendMessage };
};