import { create } from 'zustand';
import { ConnectionState } from '@/types/websocket';

interface WebSocketLog {
  timestamp: number;
  level: 'info' | 'warn' | 'error';
  message: string;
}

interface WebSocketMetrics {
  messagesSent: number;
  messagesReceived: number;
  latency: number;
  uptime: number;
  reconnectAttempts: number;
}

interface WebSocketLoggerState {
  logs: WebSocketLog[];
  metrics: WebSocketMetrics;
  connectionState: ConnectionState;
  addLog: (level: WebSocketLog['level'], message: string) => void;
  updateMetrics: (updates: Partial<WebSocketMetrics>) => void;
  updateConnectionState: (state: ConnectionState) => void;
  getLogs: () => WebSocketLog[];
  getMetrics: () => WebSocketMetrics;
  getConnectionState: () => ConnectionState;
  resetMetrics: () => void;
}

const useWebSocketLogger = create<WebSocketLoggerState>((set, get) => ({
  logs: [],
  metrics: {
    messagesSent: 0,
    messagesReceived: 0,
    latency: 0,
    uptime: 0,
    reconnectAttempts: 0,
  },
  connectionState: 'initial',

  addLog: (level, message) => {
    set((state) => ({
      logs: [
        { timestamp: Date.now(), level, message },
        ...state.logs,
      ].slice(0, 1000),
    }));
  },

  updateMetrics: (updates) => {
    set((state) => ({
      metrics: { ...state.metrics, ...updates },
    }));
  },

  updateConnectionState: (state) => {
    set({ connectionState: state });
  },

  getLogs: () => get().logs,
  getMetrics: () => get().metrics,
  getConnectionState: () => get().connectionState,

  resetMetrics: () => {
    set({
      metrics: {
        messagesSent: 0,
        messagesReceived: 0,
        latency: 0,
        uptime: 0,
        reconnectAttempts: 0,
      },
    });
  },
}));

class WebSocketLoggerInstance {
  private static instance: WebSocketLoggerInstance;

  private constructor() {}

  static getInstance(): WebSocketLoggerInstance {
    if (!WebSocketLoggerInstance.instance) {
      WebSocketLoggerInstance.instance = new WebSocketLoggerInstance();
    }
    return WebSocketLoggerInstance.instance;
  }

  getMetrics() {
    return useWebSocketLogger.getState().getMetrics();
  }

  getLogs() {
    return useWebSocketLogger.getState().getLogs();
  }

  getConnectionState() {
    return useWebSocketLogger.getState().getConnectionState();
  }
}

export const WebSocketLogger = {
  getInstance: () => WebSocketLoggerInstance.getInstance(),
  logMessage: (message: string, metadata?: Record<string, any>) => {
    useWebSocketLogger.getState().addLog('info', message);
  },
  updateConnectionState: (state: ConnectionState) => {
    useWebSocketLogger.getState().updateConnectionState(state);
  },
  incrementReconnectCount: () => {
    const currentMetrics = useWebSocketLogger.getState().getMetrics();
    useWebSocketLogger.getState().updateMetrics({
      reconnectAttempts: currentMetrics.reconnectAttempts + 1,
    });
  },
  resetMetrics: () => useWebSocketLogger.getState().resetMetrics(),
  getMetrics: () => useWebSocketLogger.getState().getMetrics(),
};