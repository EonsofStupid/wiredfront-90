import { useState, useCallback } from 'react';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { INITIAL_METRICS } from '../constants/websocket';

export const useWebSocketMetrics = () => {
  const [metrics, setMetrics] = useState<ConnectionMetrics>(INITIAL_METRICS);
  const [connectionState, setConnectionState] = useState<ConnectionState>('initial');

  const updateMetrics = useCallback((updates: Partial<ConnectionMetrics>) => {
    setMetrics(prev => {
      const newMetrics = { ...prev };
      
      if (updates.messagesSent) {
        newMetrics.messagesSent += updates.messagesSent;
      }
      if (updates.messagesReceived) {
        newMetrics.messagesReceived += updates.messagesReceived;
      }
      if (updates.latency !== undefined) {
        newMetrics.latency = updates.latency;
      }
      if (updates.lastConnected) {
        newMetrics.lastConnected = updates.lastConnected;
        newMetrics.uptime = Date.now() - updates.lastConnected.getTime();
      }
      if (updates.lastError !== undefined) {
        newMetrics.lastError = updates.lastError;
      }
      if (updates.reconnectAttempts !== undefined) {
        newMetrics.reconnectAttempts = updates.reconnectAttempts;
      }

      return newMetrics;
    });
  }, []);

  return {
    metrics,
    connectionState,
    setConnectionState,
    updateMetrics
  };
};