import { ConnectionState, ConnectionMetrics } from '@/types/websocket';

export interface WebSocketCallbacks {
  onMessage: (message: any) => void;
  onStateChange: (state: ConnectionState) => void;
  onMetricsUpdate: (metrics: Partial<ConnectionMetrics>) => void;
}

export interface WebSocketConfig {
  sessionId: string;
  callbacks: WebSocketCallbacks;
  maxReconnectAttempts?: number;
}