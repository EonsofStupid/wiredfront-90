import { useState, useCallback } from 'react';
import { ConnectionMetrics } from '@/types/websocket';
import { INITIAL_METRICS } from '../constants/websocket';
import { calculateUptime } from '../utils/websocket';

export const useWebSocketMetrics = () => {
  const [metrics, setMetrics] = useState<ConnectionMetrics>(INITIAL_METRICS);

  const updateMetrics = useCallback((updates: Partial<ConnectionMetrics>) => {
    setMetrics(prev => ({ ...prev, ...updates }));
  }, []);

  const incrementMessageCount = useCallback((type: 'sent' | 'received') => {
    setMetrics(prev => ({
      ...prev,
      [type === 'sent' ? 'messagesSent' : 'messagesReceived']: 
        prev[type === 'sent' ? 'messagesSent' : 'messagesReceived'] + 1
    }));
  }, []);

  const updateUptime = useCallback(() => {
    if (metrics.lastConnected) {
      setMetrics(prev => ({
        ...prev,
        uptime: calculateUptime(prev.lastConnected)
      }));
    }
  }, [metrics.lastConnected]);

  return {
    metrics,
    updateMetrics,
    incrementMessageCount,
    updateUptime
  };
};