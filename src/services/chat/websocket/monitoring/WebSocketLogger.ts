import { ConnectionState } from '@/types/websocket';

interface LogEntry {
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

export class WebSocketLogger {
  private static instance: WebSocketLogger;
  private logs: LogEntry[] = [];
  private connectionState: ConnectionState = 'initial';
  private metrics: WebSocketMetrics = {
    messagesSent: 0,
    messagesReceived: 0,
    latency: 0,
    uptime: 0,
    reconnectAttempts: 0
  };

  private constructor() {}

  static getInstance(): WebSocketLogger {
    if (!WebSocketLogger.instance) {
      WebSocketLogger.instance = new WebSocketLogger();
    }
    return WebSocketLogger.instance;
  }

  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  setConnectionState(state: ConnectionState) {
    this.connectionState = state;
    this.log('info', `Connection state changed to: ${state}`);
  }

  getMetrics(): WebSocketMetrics {
    return { ...this.metrics };
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  log(level: 'info' | 'warn' | 'error', message: string) {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      message
    };
    this.logs.push(entry);
    console[level](`[WebSocket] ${message}`);
  }

  incrementMessagesSent() {
    this.metrics.messagesSent++;
  }

  incrementMessagesReceived() {
    this.metrics.messagesReceived++;
  }

  updateLatency(latency: number) {
    this.metrics.latency = latency;
  }

  updateUptime(uptime: number) {
    this.metrics.uptime = uptime;
  }

  incrementReconnectAttempts() {
    this.metrics.reconnectAttempts++;
  }
}