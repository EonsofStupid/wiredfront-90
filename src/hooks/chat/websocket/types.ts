import { ConnectionState, ConnectionMetrics } from '@/types/websocket';

export interface WebSocketConfig {
  url: string;
  sessionId: string;
  isMinimized: boolean;
  onMessage: (message: any) => void;
}

export interface WebSocketState {
  connectionState: ConnectionState;
  metrics: ConnectionMetrics;
  wsRef: React.MutableRefObject<WebSocket | null>;
}

export interface WebSocketActions {
  reconnect: () => void;
  sendMessage: (message: any) => void;
}