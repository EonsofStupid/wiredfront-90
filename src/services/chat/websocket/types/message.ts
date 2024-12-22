export interface WebSocketMessage {
  id: string;
  type: 'text' | 'command' | 'system' | 'heartbeat';
  content: any;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface MessageQueueItem {
  message: WebSocketMessage;
  attempts: number;
  lastAttempt: Date | null;
}

export interface MessageHandlerConfig {
  maxRetries: number;
  retryDelay: number;
  timeout: number;
}