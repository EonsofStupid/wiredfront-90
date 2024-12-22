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

export interface WebSocketConfig {
  url: string;
  onMessage: (event: MessageEvent) => void;
  maxRetries?: number;
  initialRetryDelay?: number;
  maxRetryDelay?: number;
}

export interface WebSocketHookReturn {
  ws: WebSocket | null;
  connectionState: ConnectionState;
  metrics: ConnectionMetrics;
  reconnect: () => void;
  sendMessage: (message: any) => void;
  isConnected: boolean;
}