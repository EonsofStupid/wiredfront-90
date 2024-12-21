import { useState, useCallback, useEffect } from 'react';
import { ConnectionState } from '@/types/websocket';
import { MAX_RETRIES } from './constants/websocket';
import { calculateRetryDelay, handleConnectionError, handleMaxRetriesExceeded } from './utils/websocket';
import { useWebSocketLifecycle } from './websocket/useWebSocketLifecycle';
import { useWebSocketMetrics } from './websocket/useWebSocketMetrics';
import { WebSocketConfig } from './websocket/types';
import { toast } from 'sonner';

export const useWebSocketConnection = (
  sessionId: string,
  isMinimized: boolean,
  onMessage: (message: any) => void
) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('initial');
  const { metrics, updateMetrics, incrementMessageCount } = useWebSocketMetrics();
  const [errorLog, setErrorLog] = useState<Array<{ timestamp: Date; error: Error }>>([]);

  const config: WebSocketConfig = {
    url: `https://ewjisqyvspdvhyppkhnm.supabase.co/functions/v1/realtime-chat`,
    sessionId,
    isMinimized,
    onMessage
  };

  const {
    wsRef,
    heartbeatIntervalRef,
    messageQueueRef,
    setupWebSocketHandlers
  } = useWebSocketLifecycle(config.url, setConnectionState, updateMetrics);

  const logError = useCallback((error: Error) => {
    setErrorLog(prev => {
      const newLog = [...prev, { timestamp: new Date(), error }];
      // Keep last 100 errors
      if (newLog.length > 100) newLog.shift();
      return newLog;
    });
    console.error('WebSocket error:', error);
  }, []);

  const handleError = useCallback((error: Error) => {
    logError(error);
    updateMetrics({ lastError: error });

    if (metrics.reconnectAttempts < MAX_RETRIES) {
      setConnectionState('reconnecting');
      const delay = calculateRetryDelay(metrics.reconnectAttempts);
      
      setTimeout(() => {
        updateMetrics({ reconnectAttempts: metrics.reconnectAttempts + 1 });
        initWebSocket();
      }, delay);
      
      handleConnectionError(error);
    } else {
      setConnectionState('error');
      handleMaxRetriesExceeded();
    }
  }, [metrics.reconnectAttempts, updateMetrics, logError]);

  const initWebSocket = useCallback(() => {
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }

      setConnectionState('connecting');
      console.log('Connecting to WebSocket:', config.url);
      
      const ws = new WebSocket(config.url);
      wsRef.current = setupWebSocketHandlers(ws, onMessage);

      ws.onerror = (error) => {
        logError(error instanceof Error ? error : new Error('WebSocket connection error'));
        handleError(new Error('WebSocket connection error'));
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        setConnectionState('disconnected');
        clearInterval(heartbeatIntervalRef.current);
        
        if (metrics.reconnectAttempts < MAX_RETRIES) {
          handleError(new Error('Connection closed'));
        }
      };

    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to connect'));
      handleError(error instanceof Error ? error : new Error('Failed to connect'));
    }
  }, [config.url, handleError, metrics.reconnectAttempts, setupWebSocketHandlers, onMessage, logError]);

  const reconnect = useCallback(() => {
    updateMetrics({
      reconnectAttempts: 0,
      lastError: null
    });
    initWebSocket();
  }, [initWebSocket, updateMetrics]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      incrementMessageCount('sent');
    } else {
      messageQueueRef.current.add(message);
      toast.info('Message queued - waiting for connection');
    }
  }, [incrementMessageCount]);

  useEffect(() => {
    if (!isMinimized) {
      initWebSocket();
    }

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      clearInterval(heartbeatIntervalRef.current);
    };
  }, [initWebSocket, isMinimized]);

  return {
    ws: wsRef.current,
    connectionState,
    metrics,
    reconnect,
    sendMessage,
    isConnected: connectionState === 'connected',
    errorLog
  };
};
