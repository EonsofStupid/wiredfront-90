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

export class WebSocketError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly metadata?: Record<string, any>
  ) {
    super(message);
    this.name = 'WebSocketError';
  }
}

export class TokenExpiredError extends WebSocketError {
  constructor(message: string = 'Authentication token expired') {
    super(message, 'TOKEN_EXPIRED');
    this.name = 'TokenExpiredError';
  }
}

export class MessageSendError extends WebSocketError {
  constructor(
    message: string = 'Failed to send message',
    public readonly messageId: string,
    public readonly retryAttempt: number
  ) {
    super(message, 'MESSAGE_SEND_FAILED', { messageId, retryAttempt });
    this.name = 'MessageSendError';
  }
}