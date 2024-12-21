import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { SignalHigh, CloudOff } from 'lucide-react';

export type ConnectionState = 
  | 'initial'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'reconnecting'
  | 'error';

interface ConnectionMetrics {
  lastConnected: Date | null;
  reconnectAttempts: number;
  lastError: Error | null;
  messagesSent: number;
  messagesReceived: number;
  lastHeartbeat: Date | null;
}

const INITIAL_RETRY_DELAY = 1000;
const MAX_RETRY_DELAY = 30000;
const MAX_RETRIES = 5;
const HEARTBEAT_INTERVAL = 30000;

export const useWebSocketConnection = (
  sessionId: string,
  isMinimized: boolean,
  onMessage: (message: any) => void
) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('initial');
  const [metrics, setMetrics] = useState<ConnectionMetrics>({
    lastConnected: null,
    reconnectAttempts: 0,
    lastError: null,
    messagesSent: 0,
    messagesReceived: 0,
    lastHeartbeat: null
  });

  const wsRef = useRef<WebSocket | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const messageQueueRef = useRef<any[]>([]);

  const calculateRetryDelay = useCallback(() => {
    const backoff = Math.min(
      INITIAL_RETRY_DELAY * Math.pow(2, metrics.reconnectAttempts),
      MAX_RETRY_DELAY
    );
    // Add jitter to prevent thundering herd
    return backoff * (0.8 + Math.random() * 0.4);
  }, [metrics.reconnectAttempts]);

  const handleConnectionError = useCallback((error: Error) => {
    console.error('WebSocket error:', error);
    setMetrics(prev => ({
      ...prev,
      lastError: error
    }));

    if (metrics.reconnectAttempts < MAX_RETRIES) {
      setConnectionState('reconnecting');
      const delay = calculateRetryDelay();
      
      retryTimeoutRef.current = setTimeout(() => {
        setMetrics(prev => ({
          ...prev,
          reconnectAttempts: prev.reconnectAttempts + 1
        }));
        initWebSocket();
      }, delay);
      
      toast.error('Connection lost. Reconnecting...', {
        icon: <CloudOff className="h-5 w-5" />
      });
    } else {
      setConnectionState('error');
      toast.error('Unable to establish connection. Please try again later.', {
        duration: 5000
      });
    }
  }, [metrics.reconnectAttempts, calculateRetryDelay]);

  const sendHeartbeat = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'ping' }));
      setMetrics(prev => ({
        ...prev,
        lastHeartbeat: new Date()
      }));
    }
  }, []);

  const initWebSocket = useCallback(async () => {
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }

      setConnectionState('connecting');
      const projectId = 'ewjisqyvspdvhyppkhnm';
      const wsUrl = `wss://${projectId}.functions.supabase.co/realtime-chat`;

      console.log('Connecting to WebSocket:', wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnectionState('connected');
        setMetrics(prev => ({
          ...prev,
          lastConnected: new Date(),
          reconnectAttempts: 0,
          lastError: null
        }));

        // Process any queued messages
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

        toast.success('Connected to chat service', {
          icon: <SignalHigh className="h-5 w-5" />
        });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle heartbeat response
          if (data.type === 'pong') {
            setMetrics(prev => ({
              ...prev,
              lastHeartbeat: new Date()
            }));
            return;
          }
          
          // Handle status updates
          if (data.type === 'status') {
            if (data.status === 'disconnected') {
              handleConnectionError(new Error(data.reason || 'Connection closed'));
            }
            return;
          }

          setMetrics(prev => ({
            ...prev,
            messagesReceived: prev.messagesReceived + 1
          }));

          console.log('Received message:', data);
          onMessage(data);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        handleConnectionError(new Error('WebSocket connection error'));
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        setConnectionState('disconnected');
        clearInterval(heartbeatIntervalRef.current);
        
        if (metrics.reconnectAttempts < MAX_RETRIES) {
          handleConnectionError(new Error('Connection closed'));
        }
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      handleConnectionError(error instanceof Error ? error : new Error('Failed to connect'));
    }
  }, [handleConnectionError, onMessage, sendHeartbeat]);

  // Initialize WebSocket when component mounts or when minimized state changes
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
    };
  }, [initWebSocket, isMinimized]);

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
      // Queue message for later sending
      messageQueueRef.current.push(message);
    }
  }, []);

  return {
    ws: wsRef.current,
    connectionState,
    metrics,
    reconnect,
    sendMessage,
    isConnected: connectionState === 'connected'
  };
};