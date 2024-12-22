export type WebSocketReadyState = 0 | 1 | 2 | 3;

export type ConnectionState = 
  | 'initial'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'reconnecting'
  | 'error'
  | 'failed';

export interface ConnectionMetrics {
  lastConnected: Date | null;
  reconnectAttempts: number;
  lastError: Error | null;
  messagesSent: number;
  messagesReceived: number;
  lastHeartbeat: Date | null;
  latency: number;
  uptime: number;
}

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