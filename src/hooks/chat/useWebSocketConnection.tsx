import { useState, useEffect, useCallback } from 'react';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { ConnectionManager } from '@/services/chat/ConnectionManager';
import { messageQueue } from '@/services/chat/MessageQueueService';
import { toast } from "sonner";

export const useWebSocketConnection = (
  sessionId: string,
  isMinimized: boolean,
  onMessage: (message: any) => void
) => {
  const [connectionManager, setConnectionManager] = useState<ConnectionManager | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('initial');
  const [metrics, setMetrics] = useState<ConnectionMetrics>({
    lastConnected: null,
    reconnectAttempts: 0,
    lastError: null,
    messagesSent: 0,
    messagesReceived: 0,
    lastHeartbeat: null,
    latency: 0,
    uptime: 0,
  });

  useEffect(() => {
    if (!isMinimized) {
      const wsUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/realtime-chat`;
      const manager = new ConnectionManager(wsUrl);
      
      manager.onStateChange = (state) => {
        setConnectionState(state);
        if (state === 'connected') {
          processPendingMessages();
        }
      };

      manager.onMessage = onMessage;
      setConnectionManager(manager);
      manager.connect();

      return () => {
        manager.destroy();
      };
    }
  }, [isMinimized, sessionId, onMessage]);

  const processPendingMessages = useCallback(async () => {
    if (connectionState !== 'connected' || !connectionManager) return;

    const pending = await messageQueue.getPendingMessages();
    for (const item of pending) {
      try {
        if (connectionManager.send(item.message)) {
          await messageQueue.updateStatus(item.id, 'delivered');
        }
      } catch (error) {
        console.error('Failed to process pending message:', error);
        await messageQueue.updateStatus(item.id, 'failed');
      }
    }
  }, [connectionState, connectionManager]);

  const sendMessage = useCallback(async (message: any) => {
    if (connectionState !== 'connected' || !connectionManager) {
      const queuedMessage = await messageQueue.enqueue(message);
      toast.info('Message queued - waiting for connection');
      return queuedMessage.id;
    }

    try {
      if (connectionManager.send(message)) {
        return null; // No queue ID needed for direct sends
      } else {
        const queuedMessage = await messageQueue.enqueue(message);
        toast.info('Message queued - connection unavailable');
        return queuedMessage.id;
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
      throw error;
    }
  }, [connectionState, connectionManager]);

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (connectionManager) {
        setMetrics(connectionManager.getMetrics());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [connectionManager]);

  return {
    ws: connectionManager?.getWebSocket() || null,
    connectionState,
    metrics,
    sendMessage,
    isConnected: connectionState === 'connected',
    reconnect: () => connectionManager?.reconnect()
  };
};