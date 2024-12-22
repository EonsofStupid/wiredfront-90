import { useEffect, useRef, useState } from 'react';
import { ConnectionState } from '@/types/websocket';

interface WebSocketConfig {
  url: string;
  maxRetries?: number;
  initialRetryDelay?: number;
  maxRetryDelay?: number;
  onMessage?: (event: MessageEvent) => void;
  onStateChange?: (state: ConnectionState) => void;
}

export const useWebSocketLifecycle = ({
  url,
  maxRetries = 5,
  initialRetryDelay = 1000,
  maxRetryDelay = 30000,
  onMessage,
  onStateChange
}: WebSocketConfig) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('initial');
  const wsRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const isConnectingRef = useRef(false);

  const updateConnectionState = (newState: ConnectionState) => {
    setConnectionState(newState);
    onStateChange?.(newState);
  };

  const clearRetryTimeout = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = undefined;
    }
  };

  const connect = () => {
    if (isConnectingRef.current || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    isConnectingRef.current = true;
    updateConnectionState('connecting');

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        isConnectingRef.current = false;
        retryCountRef.current = 0;
        updateConnectionState('connected');
      };

      ws.onmessage = (event) => {
        onMessage?.(event);
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        isConnectingRef.current = false;
        wsRef.current = null;
        updateConnectionState('disconnected');

        if (retryCountRef.current < maxRetries) {
          const delay = Math.min(
            initialRetryDelay * Math.pow(2, retryCountRef.current),
            maxRetryDelay
          );
          console.log(`Attempting to reconnect in ${delay}ms (attempt ${retryCountRef.current + 1})`);
          clearRetryTimeout();
          retryTimeoutRef.current = setTimeout(() => {
            retryCountRef.current++;
            connect();
          }, delay);
        } else {
          updateConnectionState('failed');
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        isConnectingRef.current = false;
        updateConnectionState('error');
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      isConnectingRef.current = false;
      updateConnectionState('failed');
    }
  };

  const disconnect = () => {
    clearRetryTimeout();
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    isConnectingRef.current = false;
    updateConnectionState('disconnected');
  };

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [url]);

  return {
    connectionState,
    disconnect,
    reconnect: () => {
      retryCountRef.current = 0;
      connect();
    },
    ws: wsRef.current
  };
};