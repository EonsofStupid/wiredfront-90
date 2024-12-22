import { create } from 'zustand';
import { WebSocketStore } from './types';
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';

const initialMetrics = {
  lastConnected: null,
  reconnectAttempts: 0,
  lastError: null,
  messagesSent: 0,
  messagesReceived: 0,
  lastHeartbeat: null,
  latency: 0,
  uptime: 0,
};

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  connectionState: 'initial',
  metrics: initialMetrics,
  messageHistory: [],
  errors: {
    lastError: null,
    errorCount: 0,
  },

  setConnectionState: (state) => {
    const previousState = get().connectionState;
    logger.info('WebSocket state transition', {
      from: previousState,
      to: state,
      timestamp: new Date().toISOString(),
    });

    set({ connectionState: state });

    // User feedback for state changes
    switch (state) {
      case 'connected':
        toast.success('Connected to chat service');
        break;
      case 'disconnected':
        toast.error('Disconnected from chat service');
        break;
      case 'reconnecting':
        toast.loading('Attempting to reconnect...');
        break;
      case 'error':
        toast.error('Connection error occurred');
        break;
    }

    logger.info('UI updated after state change', {
      state,
      timestamp: new Date().toISOString(),
    });
  },

  updateMetrics: (metrics) => {
    set((state) => ({
      metrics: { ...state.metrics, ...metrics },
    }));
    logger.debug('WebSocket metrics updated', { metrics });
  },

  addMessage: (message) => {
    set((state) => ({
      messageHistory: [message, ...state.messageHistory],
    }));
    logger.debug('Message added to history', {
      messageId: message.id,
      timestamp: new Date().toISOString(),
    });
  },

  setError: (error) => {
    set((state) => ({
      errors: {
        lastError: error,
        errorCount: state.errors.errorCount + (error ? 1 : 0),
      },
    }));

    if (error) {
      logger.error('WebSocket error occurred', {
        error,
        errorCount: get().errors.errorCount,
        timestamp: new Date().toISOString(),
      });
    }
  },

  clearErrors: () => {
    set({
      errors: {
        lastError: null,
        errorCount: 0,
      },
    });
    logger.info('WebSocket errors cleared');
  },

  clearMessageHistory: () => {
    set({ messageHistory: [] });
    logger.info('Message history cleared');
  },
}));