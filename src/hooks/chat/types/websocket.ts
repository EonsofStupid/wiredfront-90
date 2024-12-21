export type ConnectionState = 
  | 'initial'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'reconnecting'
  | 'error';

export interface ConnectionMetrics {
  lastConnected: Date | null;
  reconnectAttempts: number;
  lastError: Error | null;
  messagesSent: number;
  messagesReceived: number;
  lastHeartbeat: Date | null;
}

export interface WebSocketConfig {
  url: string;
  sessionId: string;
  isMinimized: boolean;
  onMessage: (message: any) => void;
}

export interface WebSocketHookReturn {
  ws: WebSocket | null;
  connectionState: ConnectionState;
  metrics: ConnectionMetrics;
  reconnect: () => void;
  sendMessage: (message: any) => void;
  isConnected: boolean;
}