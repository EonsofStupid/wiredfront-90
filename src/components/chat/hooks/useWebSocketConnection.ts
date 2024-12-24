import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';

export const useWebSocketConnection = (onMessage: (content: string) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, []);

  const connect = useCallback(() => {
    cleanup();

    const ws = new WebSocket(`wss://ewjisqyvspdvhyppkhnm.functions.supabase.co/functions/v1/realtime-chat`);
    wsRef.current = ws;

    ws.onopen = () => {
      logger.info('Connected to chat WebSocket');
      setIsConnected(true);
      toast.success('Connected to AI chat');
    };

    ws.onclose = () => {
      logger.info('Disconnected from chat WebSocket');
      setIsConnected(false);
      wsRef.current = null;

      // Only attempt reconnect if not manually closed
      if (!ws.wasClean) {
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      }
    };

    ws.onerror = (error) => {
      logger.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'response.message.delta') {
          onMessage(data.delta);
        }
      } catch (error) {
        logger.error('Error processing message:', error);
      }
    };
  }, [cleanup, onMessage]);

  useEffect(() => {
    connect();
    return cleanup;
  }, [connect, cleanup]);

  const sendMessage = useCallback(async (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  return { isConnected, sendMessage };
};