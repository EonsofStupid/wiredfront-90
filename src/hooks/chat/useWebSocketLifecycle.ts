import { useRef, useCallback, useState } from 'react';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { supabase } from "@/integrations/supabase/client";
import { MessageQueueManager } from '../utils/messageQueue';
import { HEARTBEAT_INTERVAL, INITIAL_RETRY_DELAY, MAX_RETRY_DELAY, MAX_RETRIES } from '../constants/websocket';
import { toast } from 'sonner';

export const useWebSocketLifecycle = (
  url: string,
  setConnectionState: (state: ConnectionState) => void,
  updateMetrics: (updates: Partial<ConnectionMetrics>) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const messageQueueRef = useRef<MessageQueueManager>(new MessageQueueManager());
  const pingTimeRef = useRef<number>(0);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [isConnecting, setIsConnecting] = useState(false);

  const clearHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = undefined;
    }
  }, []);

  const clearRetryTimeout = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = undefined;
    }
  }, []);

  const cleanup = useCallback(() => {
    clearHeartbeat();
    clearRetryTimeout();
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, [clearHeartbeat, clearRetryTimeout]);

  const calculateRetryDelay = useCallback(() => {
    const baseDelay = Math.min(INITIAL_RETRY_DELAY * Math.pow(2, retryCountRef.current), MAX_RETRY_DELAY);
    const jitter = 0.2; // 20% random jitter
    return Math.floor(baseDelay * (1 - jitter + Math.random() * jitter * 2));
  }, []);

  const connect = useCallback(async () => {
    if (isConnecting || wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connecting or connected');
      return;
    }

    try {
      setIsConnecting(true);
      setConnectionState('connecting');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      cleanup();

      console.log('Connecting to WebSocket:', url);
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected successfully');
        setIsConnecting(false);
        retryCountRef.current = 0;
        setConnectionState('connected');
        updateMetrics({ lastConnected: new Date() });
        toast.success('Connected to chat service');

        // Set up heartbeat
        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            pingTimeRef.current = Date.now();
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, HEARTBEAT_INTERVAL);

        // Process any queued messages
        const queuedMessages = messageQueueRef.current.getAll();
        queuedMessages.forEach(message => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
            messageQueueRef.current.remove(message.id);
          }
        });
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        setIsConnecting(false);
        setConnectionState('disconnected');
        cleanup();

        // Attempt reconnection if not max retries
        if (retryCountRef.current < MAX_RETRIES) {
          const delay = calculateRetryDelay();
          console.log(`Attempting to reconnect in ${delay}ms (attempt ${retryCountRef.current + 1})`);
          retryTimeoutRef.current = setTimeout(() => {
            retryCountRef.current++;
            connect();
          }, delay);
        } else {
          console.error('Max reconnection attempts reached');
          setConnectionState('failed');
          toast.error('Unable to establish connection. Please try again later.');
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        updateMetrics({ lastError: error as Error });
        setConnectionState('error');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'pong') {
            const latency = Date.now() - pingTimeRef.current;
            updateMetrics({ latency });
            return;
          }

          updateMetrics({ messagesReceived: prev => (prev || 0) + 1 });
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      setIsConnecting(false);
      setConnectionState('error');
      updateMetrics({ lastError: error as Error });

      if (retryCountRef.current < MAX_RETRIES) {
        const delay = calculateRetryDelay();
        console.log(`Attempting to reconnect in ${delay}ms (attempt ${retryCountRef.current + 1})`);
        retryTimeoutRef.current = setTimeout(() => {
          retryCountRef.current++;
          connect();
        }, delay);
      } else {
        setConnectionState('failed');
        toast.error('Unable to establish connection. Please try again later.');
      }
    }
  }, [url, isConnecting, cleanup, setConnectionState, updateMetrics, calculateRetryDelay]);

  return {
    wsRef,
    connect,
    cleanup,
    messageQueueRef
  };
};