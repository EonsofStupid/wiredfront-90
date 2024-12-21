import { useCallback, useRef } from 'react';
import { ConnectionState, ConnectionMetrics, WebSocketConfig } from './types/websocket';
import { HEARTBEAT_INTERVAL } from './constants/websocket';
import { handleConnectionSuccess } from './utils/websocket';

export const useWebSocketLifecycle = (
  config: WebSocketConfig,
  setConnectionState: (state: ConnectionState) => void,
  setMetrics: (metrics: ConnectionMetrics | ((prev: ConnectionMetrics) => ConnectionMetrics)) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const messageQueueRef = useRef<any[]>([]);

  const sendHeartbeat = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'ping' }));
      setMetrics(prev => ({
        ...prev,
        lastHeartbeat: new Date()
      }));
    }
  }, [setMetrics]);

  const setupWebSocketHandlers = useCallback((ws: WebSocket) => {
    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnectionState('connected');
      setMetrics(prev => ({
        ...prev,
        lastConnected: new Date(),
        reconnectAttempts: 0,
        lastError: null
      }));

      // Process queued messages
      while (messageQueueRef.current.length > 0) {
        const message = messageQueueRef.current.shift();
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(message));
          setMetrics(prev => ({
            ...prev,
            messagesSent: prev.messagesSent + 1
          }));
        }
      }

      // Start heartbeat
      heartbeatIntervalRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
      handleConnectionSuccess();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'pong') {
          setMetrics(prev => ({
            ...prev,
            lastHeartbeat: new Date()
          }));
          return;
        }
        
        if (data.type === 'status' && data.status === 'disconnected') {
          throw new Error(data.reason || 'Connection closed');
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