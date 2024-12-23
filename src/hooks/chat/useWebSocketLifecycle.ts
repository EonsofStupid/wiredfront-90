import { useCallback, useRef } from 'react';
import { ConnectionState, ConnectionMetrics, WebSocketConfig } from '@/types/websocket';
import { HEARTBEAT_INTERVAL } from './constants/websocket';
import { calculateLatency } from './utils/websocket';
import { MessageQueueManager } from './utils/messageQueue';
import { supabase } from "@/integrations/supabase/client";

export const useWebSocketLifecycle = (
  config: WebSocketConfig,
  setConnectionState: (state: ConnectionState) => void,
  setMetrics: (metrics: ConnectionMetrics | ((prev: ConnectionMetrics) => ConnectionMetrics)) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const messageQueueRef = useRef<MessageQueueManager>(new MessageQueueManager());
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

  const setupWebSocketHandlers = useCallback((ws: WebSocket) => {
    ws.onopen = () => {
      console.log('WebSocket connected');
      const connectedAt = new Date();
      setConnectionState('connected');
      setMetrics(prev => ({
        ...prev,
        lastConnected: connectedAt,
        reconnectAttempts: 0,
        lastError: null
      }));

      // Process queued messages
      const queuedMessages = messageQueueRef.current.getAll();
      queuedMessages.forEach(message => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(message));
          messageQueueRef.current.remove(message.id);
          setMetrics(prev => ({
            ...prev,
            messagesSent: prev.messagesSent + 1
          }));
        }
      });

      // Start heartbeat with authentication
      heartbeatIntervalRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'pong') {
          const latency = calculateLatency(pingTimeRef.current);
          setMetrics(prev => ({
            ...prev,
            lastHeartbeat: new Date(),
            latency
          }));
          return;
        }
        
        setMetrics(prev => ({
          ...prev,
          messagesReceived: prev.messagesReceived + 1
        }));

        config.onMessage(data);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    return ws;
  }, [config.onMessage, sendHeartbeat, setConnectionState, setMetrics]);

  return {
    wsRef,
    heartbeatIntervalRef,
    messageQueueRef,
    setupWebSocketHandlers
  };
};