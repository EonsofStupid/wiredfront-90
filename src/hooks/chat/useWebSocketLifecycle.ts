import { useRef, useCallback } from 'react';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { supabase } from "@/integrations/supabase/client";
import { MessageQueue } from './utils/messageQueue';
import { HEARTBEAT_INTERVAL } from './constants/websocket';

export const useWebSocketLifecycle = (
  url: string,
  setConnectionState: (state: ConnectionState) => void,
  updateMetrics: (updates: Partial<ConnectionMetrics>) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const messageQueueRef = useRef<MessageQueue>(new MessageQueue());
  const pingTimeRef = useRef<number>(0);

  const sendHeartbeat = useCallback(async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const { data: { session } } = await supabase.auth.getSession();
      pingTimeRef.current = Date.now();
      wsRef.current.send(JSON.stringify({ 
        type: 'ping',
        auth: {
          access_token: session?.access_token
        }
      }));
    }
  }, []);

  const setupWebSocketHandlers = useCallback((ws: WebSocket, onMessage: (message: any) => void) => {
    ws.onopen = () => {
      const connectedAt = new Date();
      setConnectionState('connected');
      updateMetrics({
        lastConnected: connectedAt,
        reconnectAttempts: 0,
        lastError: null
      });

      const queuedMessages = messageQueueRef.current.getAll();
      queuedMessages.forEach(message => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(message));
          messageQueueRef.current.remove(message.id);
        }
      });

      heartbeatIntervalRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'pong') {
          const latency = Date.now() - pingTimeRef.current;
          updateMetrics({ latency });
          return;
        }
        onMessage(data);
        updateMetrics({ messagesReceived: prev => (prev || 0) + 1 });
      } catch (error) {
        console.error('Error parsing message:', error);
        updateMetrics({ lastError: new Error('Failed to parse message') });
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      updateMetrics({ lastError: new Error('WebSocket connection error') });
      setConnectionState('error');
    };

    ws.onclose = () => {
      setConnectionState('disconnected');
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };

    return ws;
  }, [setConnectionState, updateMetrics, sendHeartbeat]);

  return {
    wsRef,
    heartbeatIntervalRef,
    messageQueueRef,
    pingTimeRef,
    setupWebSocketHandlers
  };
};