import { ConnectionState, ConnectionMetrics } from '@/types/websocket';

interface LogEntry {
  timestamp: number;
  message: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  metadata?: any;
}

export class WebSocketLogger {
  private static instance: WebSocketLogger;
  private logs: LogEntry[] = [];
  private metrics: ConnectionMetrics = {
    lastConnected: null,
    reconnectAttempts: 0,
    lastError: null,
    messagesSent: 0,
    messagesReceived: 0,
    lastHeartbeat: null,
    latency: 0,
    uptime: 0
  };
  private connectionState: ConnectionState = 'initial';

  private constructor() {}

  static getInstance(): WebSocketLogger {
    if (!WebSocketLogger.instance) {
      WebSocketLogger.instance = new WebSocketLogger();
    }
    return WebSocketLogger.instance;
  }

  log(level: 'debug' | 'info' | 'warn' | 'error', message: string, metadata?: any) {
    const entry: LogEntry = {
      timestamp: Date.now(),
      message,
      level,
      metadata
    };
    
    this.logs.unshift(entry);
    if (this.logs.length > 1000) {
      this.logs.pop();
    }

    console[level](message, metadata);
  }

  updateMetrics(updates: Partial<ConnectionMetrics>) {
    this.metrics = { ...this.metrics, ...updates };
    if (this.metrics.lastConnected) {
      this.metrics.uptime = Date.now() - this.metrics.lastConnected.getTime();
    }
    this.log('info', 'Metrics updated', { updates });
  }

  updateConnectionState(state: ConnectionState) {
    this.connectionState = state;
    this.log('info', `Connection state changed to ${state}`);
  }

  getMetrics(): ConnectionMetrics {
    return { ...this.metrics };
  }

  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}