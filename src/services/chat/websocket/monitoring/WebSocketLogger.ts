import { create } from 'zustand';
import { logger } from '@/services/chat/LoggingService';

interface WebSocketMetrics {
  totalMessages: number;
  connectedAt: Date | null;
  lastMessageAt: Date | null;
  reconnectCount: number;
  currentState: 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
}

interface WebSocketLoggerState {
  metrics: WebSocketMetrics;
  logMessage: (message: string, metadata?: Record<string, any>) => void;
  updateConnectionState: (state: WebSocketMetrics['currentState']) => void;
  incrementReconnectCount: () => void;
  resetMetrics: () => void;
  getMetrics: () => WebSocketMetrics;
}

export const useWebSocketLogger = create<WebSocketLoggerState>((set, get) => ({
  metrics: {
    totalMessages: 0,
    connectedAt: null,
    lastMessageAt: null,
    reconnectCount: 0,
    currentState: 'DISCONNECTED',
  },

  logMessage: (message, metadata) => {
    logger.debug(`WebSocket: ${message}`, metadata);
    set((state) => ({
      metrics: {
        ...state.metrics,
        totalMessages: state.metrics.totalMessages + 1,
        lastMessageAt: new Date(),
      },
    }));
  },

  updateConnectionState: (currentState) => {
    set((state) => ({
      metrics: {
        ...state.metrics,
        currentState,
        connectedAt: currentState === 'CONNECTED' ? new Date() : state.metrics.connectedAt,
      },
    }));
  },

  incrementReconnectCount: () => {
    set((state) => ({
      metrics: {
        ...state.metrics,
        reconnectCount: state.metrics.reconnectCount + 1,
      },
    }));
  },

  resetMetrics: () => {
    set({
      metrics: {
        totalMessages: 0,
        connectedAt: null,
        lastMessageAt: null,
        reconnectCount: 0,
        currentState: 'DISCONNECTED',
      },
    });
  },

  getMetrics: () => get().metrics,
}));

export const WebSocketLogger = {
  logMessage: useWebSocketLogger.getState().logMessage,
  updateConnectionState: useWebSocketLogger.getState().updateConnectionState,
  incrementReconnectCount: useWebSocketLogger.getState().incrementReconnectCount,
  resetMetrics: useWebSocketLogger.getState().resetMetrics,
  getMetrics: useWebSocketLogger.getState().getMetrics,
};