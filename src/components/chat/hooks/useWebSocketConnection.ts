import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { WEBSOCKET_URL } from '@/constants/websocket';

export const useWebSocketConnection = (onMessage: (content: string) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);

  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = undefined;
    }
  }, []);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;
    cleanup();

    const ws = new WebSocket(WEBSOCKET_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) return;
      logger.info('Connected to chat WebSocket');
      setIsConnected(true);
      toast.success('Connected to AI chat', { id: 'ws-connected' });
    };

    ws.onclose = (event: CloseEvent) => {
      if (!mountedRef.current) return;
      logger.info('Disconnected from chat WebSocket');
      setIsConnected(false);
      wsRef.current = null;

      if (!event.wasClean && mountedRef.current) {
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      }
    };

    ws.onerror = (error) => {
      if (!mountedRef.current) return;
      logger.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      if (!mountedRef.current) return;
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
    mountedRef.current = true;
    connect();
    
    return () => {
      mountedRef.current = false;
      cleanup();
    };
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