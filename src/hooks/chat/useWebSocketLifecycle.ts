import { useEffect, useRef, useState } from 'react';
import { ConnectionState } from '@/types/websocket';

interface WebSocketConfig {
  url: string;
  onMessage?: (event: MessageEvent) => void;
  maxRetries?: number;
  initialRetryDelay?: number;
  maxRetryDelay?: number;
}

export const useWebSocketLifecycle = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('initial');
  const wsRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const isConnectingRef = useRef(false);

  const updateConnectionState = (newState: ConnectionState) => {
    setConnectionState(newState);
  };

  const clearRetryTimeout = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = undefined;
    }
  };

  const connect = (config: WebSocketConfig) => {
    if (isConnectingRef.current || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const maxRetries = config.maxRetries ?? 5;
    const initialRetryDelay = config.initialRetryDelay ?? 1000;
    const maxRetryDelay = config.maxRetryDelay ?? 30000;

    isConnectingRef.current = true;
    updateConnectionState('connecting');

    try {
      const ws = new WebSocket(config.url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        isConnectingRef.current = false;
        retryCountRef.current = 0;
        updateConnectionState('connected');
      };

      ws.onmessage = (event) => {
        config.onMessage?.(event);
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
            connect(config);
          }, delay);
        } else {
          updateConnectionState('error');
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        isConnectingRef.current = false;
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      isConnectingRef.current = false;
      updateConnectionState('error');
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

  return {
    connectionState,
    disconnect,
    connect,
    ws: wsRef.current
  };
};