import { useEffect, useRef, useState, useCallback } from 'react';
import { ConnectionState } from '@/types/websocket';

export const useWebSocketLifecycle = (wsUrl: string) => {
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

  const connect = useCallback(() => {
    if (isConnectingRef.current || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    isConnectingRef.current = true;
    updateConnectionState('connecting');

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        isConnectingRef.current = false;
        retryCountRef.current = 0;
        updateConnectionState('connected');
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        isConnectingRef.current = false;
        wsRef.current = null;
        updateConnectionState('disconnected');
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        isConnectingRef.current = false;
        updateConnectionState('error');
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      isConnectingRef.current = false;
      updateConnectionState('error');
    }
  }, [wsUrl]);

  const disconnect = useCallback(() => {
    clearRetryTimeout();
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    isConnectingRef.current = false;
    updateConnectionState('disconnected');
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connectionState,
    disconnect,
    connect,
    ws: wsRef.current
  };
};