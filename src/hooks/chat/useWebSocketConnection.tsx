import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { toast } from 'sonner';
import { SignalHigh, CloudOff } from 'lucide-react';

interface WebSocketConnection {
  ws: WebSocket | null;
  isConnected: boolean;
  reconnect: () => Promise<void>;
}

export const useWebSocketConnection = (
  sessionId: string,
  isMinimized: boolean,
  onMessage: (message: any) => void
): WebSocketConnection => {
  const [wsRef, setWsRef] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  const initWebSocket = useCallback(async () => {
    try {
      const projectId = 'ewjisqyvspdvhyppkhnm';
      const wsUrl = `wss://${projectId}.functions.supabase.co/realtime-chat`;

      console.log('Connecting to WebSocket:', wsUrl);

      const ws = new WebSocket(wsUrl);
      setWsRef(ws);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setRetryCount(0);
        toast.success('Connected to chat service', {
          icon: SignalHigh
        });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received message:', data);
          onMessage(data);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        toast.error('Chat connection error', {
          description: 'Please try again later',
          icon: CloudOff
        });
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        setIsConnected(false);
        setWsRef(null);

        if (retryCount < MAX_RETRIES) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            initWebSocket();
          }, RETRY_DELAY);
        }
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      toast.error('Failed to connect to chat service');
    }
  }, [onMessage, retryCount]);

  useEffect(() => {
    if (!isMinimized) {
      initWebSocket();
      return () => {
        if (wsRef?.readyState === WebSocket.OPEN) {
          wsRef.close();
        }
      };
    }
  }, [initWebSocket, isMinimized, wsRef]);

  return {
    ws: wsRef,
    isConnected,
    reconnect: initWebSocket
  };
};