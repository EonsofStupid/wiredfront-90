import { useState, useCallback, useEffect, useRef } from 'react';
import { ConnectionState, ConnectionMetrics, WebSocketHookReturn } from '@/types/websocket';
import { INITIAL_METRICS, MAX_RETRIES } from './constants/websocket';
import { 
  calculateRetryDelay, 
  handleConnectionError, 
  handleMaxRetriesExceeded, 
  calculateUptime 
} from './utils/websocket';
import { useWebSocketLifecycle } from './useWebSocketLifecycle';
import { supabase } from "@/integrations/supabase/client";

export const useWebSocketConnection = (
  sessionId: string,
  isMinimized: boolean,
  onMessage: (message: any) => void
): WebSocketHookReturn => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('initial');
  const [metrics, setMetrics] = useState<ConnectionMetrics>(INITIAL_METRICS);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const uptimeIntervalRef = useRef<ReturnType<typeof setInterval>>();

  const config = {
    // Get the base URL from the environment or construct it from the project ID
    url: `${process.env.SUPABASE_URL || 'https://ewjisqyvspdvhyppkhnm.supabase.co'}/functions/v1/realtime-chat`,
    sessionId,
    isMinimized,
    onMessage
  };

  const {
    wsRef,
    heartbeatIntervalRef,
    messageQueueRef,
    setupWebSocketHandlers
  } = useWebSocketLifecycle(config, setConnectionState, setMetrics);

  const handleError = useCallback((error: Error) => {
    console.error('WebSocket error:', error);
    setMetrics(prev => ({
      ...prev,
      lastError: error
    }));

    if (metrics.reconnectAttempts < MAX_RETRIES) {
      setConnectionState('reconnecting');
      const delay = calculateRetryDelay(metrics.reconnectAttempts);
      
      retryTimeoutRef.current = setTimeout(() => {
        setMetrics(prev => ({
          ...prev,
          reconnectAttempts: prev.reconnectAttempts + 1
        }));
        initWebSocket();
      }, delay);
      
      handleConnectionError(error);
    } else {
      setConnectionState('error');
      handleMaxRetriesExceeded();
    }
  }, [metrics.reconnectAttempts]);

  const initWebSocket = useCallback(() => {
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }

      setConnectionState('connecting');
      console.log('Connecting to WebSocket:', config.url);
      
      const ws = new WebSocket(config.url);
      wsRef.current = setupWebSocketHandlers(ws);

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        handleError(new Error('WebSocket connection error'));
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        setConnectionState('disconnected');
        clearInterval(heartbeatIntervalRef.current);
        clearInterval(uptimeIntervalRef.current);
        
        if (metrics.reconnectAttempts < MAX_RETRIES) {
          handleError(new Error('Connection closed'));
        }
      };

      // Start tracking uptime
      uptimeIntervalRef.current = setInterval(() => {
        if (metrics.lastConnected) {
          setMetrics(prev => ({
            ...prev,
            uptime: calculateUptime(prev.lastConnected)
          }));
        }
      }, 1000);

    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      handleError(error instanceof Error ? error : new Error('Failed to connect'));
    }
  }, [config.url, handleError, metrics.reconnectAttempts, setupWebSocketHandlers]);

  const reconnect = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      reconnectAttempts: 0,
      lastError: null
    }));
    initWebSocket();
  }, [initWebSocket]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      setMetrics(prev => ({
        ...prev,
        messagesSent: prev.messagesSent + 1
      }));
    } else {
      messageQueueRef.current.add(message);
    }
  }, []);

  useEffect(() => {
    if (!isMinimized) {
      initWebSocket();
    }

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      clearTimeout(retryTimeoutRef.current);
      clearInterval(heartbeatIntervalRef.current);
      clearInterval(uptimeIntervalRef.current);
    };
  }, [initWebSocket, isMinimized]);

  return {
    ws: wsRef.current,
    connectionState,
    metrics,
    reconnect,
    sendMessage,
    isConnected: connectionState === 'connected'
  };
};