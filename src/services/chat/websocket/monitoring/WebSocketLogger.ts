import { ConnectionState, ConnectionMetrics } from '@/types/websocket';

interface LogEntry {
  timestamp: number;
  message: string;
  level: 'info' | 'warn' | 'error';
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

  /**
   * Gets the singleton instance of WebSocketLogger
   */
  static getInstance(): WebSocketLogger {
    if (!WebSocketLogger.instance) {
      WebSocketLogger.instance = new WebSocketLogger();
    }
    return WebSocketLogger.instance;
  }

  /**
   * Logs a message with the specified level and metadata
   */
  log(level: 'info' | 'warn' | 'error', message: string, metadata?: any) {
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

    // Also log to console for debugging
    console[level](message, metadata);
  }

  /**
   * Updates WebSocket metrics
   */
  updateMetrics(updates: Partial<ConnectionMetrics>) {
    this.metrics = { ...this.metrics, ...updates };
    if (this.metrics.lastConnected) {
      this.metrics.uptime = Date.now() - this.metrics.lastConnected.getTime();
    }
    this.log('info', 'Metrics updated', { updates });
  }

  /**
   * Updates the WebSocket connection state
   */
  updateConnectionState(state: ConnectionState) {
    this.connectionState = state;
    this.log('info', `Connection state changed to ${state}`);
  }

  /**
   * Gets the current WebSocket metrics
   */
  getMetrics(): ConnectionMetrics {
    return { ...this.metrics };
  }

  /**
   * Gets the current connection state
   */
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  /**
   * Gets all logged entries
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Clears all logs
   */
  clearLogs() {
    this.logs = [];
  }
}