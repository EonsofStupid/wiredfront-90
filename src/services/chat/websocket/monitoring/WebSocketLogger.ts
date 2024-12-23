import { ConnectionState, ConnectionMetrics } from '@/types/websocket';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: number;
  message: string;
  level: LogLevel;
  metadata?: any;
  context?: string;
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

  constructor(private sessionId: string) {
    this.log('debug', 'WebSocket Logger initialized', {
      sessionId,
      timestamp: new Date().toISOString(),
      context: 'logger_init'
    });
  }

  log(level: LogLevel, message: string, metadata?: any) {
    const entry: LogEntry = {
      timestamp: Date.now(),
      message,
      level,
      metadata: {
        ...metadata,
        sessionId: this.sessionId
      },
      context: metadata?.context || 'general'
    };
    
    this.logs.unshift(entry);
    if (this.logs.length > 1000) {
      this.logs.pop();
    }

    // Enhanced console logging with context
    const logPrefix = `[${new Date(entry.timestamp).toISOString()}][${level.toUpperCase()}][${entry.context}]`;
    const logMessage = `${logPrefix} ${message}`;

    switch (level) {
      case 'debug':
        console.debug(logMessage, metadata);
        break;
      case 'info':
        console.info(logMessage, metadata);
        break;
      case 'warn':
        console.warn(logMessage, metadata);
        break;
      case 'error':
        console.error(logMessage, metadata);
        if (metadata?.error?.stack) {
          console.error('Stack trace:', metadata.error.stack);
        }
        break;
    }

    return entry;
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
    if (this.metrics.lastConnected) {
      this.metrics.uptime = Date.now() - this.metrics.lastConnected.getTime();
    }
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
    this.log('info', 'Logs cleared');
  }
}