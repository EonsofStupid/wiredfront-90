import { Message } from '@/types/chat';

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
  latency: number;
  uptime: number;
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

export interface MessageQueue {
  messages: Message[];
  add: (message: Message) => void;
  remove: (messageId: string) => void;
  clear: () => void;
}