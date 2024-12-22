import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { Message } from '@/types/chat';

export interface WebSocketState {
  connectionState: ConnectionState;
  metrics: ConnectionMetrics;
  messageHistory: Message[];
  errors: {
    lastError: Error | null;
    errorCount: number;
  };
}

export interface WebSocketActions {
  setConnectionState: (state: ConnectionState) => void;
  updateMetrics: (metrics: Partial<ConnectionMetrics>) => void;
  addMessage: (message: Message) => void;
  setError: (error: Error | null) => void;
  clearErrors: () => void;
  clearMessageHistory: () => void;
}

export type WebSocketStore = WebSocketState & WebSocketActions;