import { ConnectionState } from '@/types/websocket';
import { logger } from '../../LoggingService';

interface WebSocketLog {
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
  private logs: WebSocketLog[] = [];
  private metrics: WebSocketMetrics = {
    messagesSent: 0,
    messagesReceived: 0,
    latency: 0,
    uptime: 0,
    reconnectAttempts: 0,
  };
  private connectionState: ConnectionState = 'disconnected';
  private startTime: number = Date.now();

  private constructor() {}

  static getInstance(): WebSocketLogger {
    if (!WebSocketLogger.instance) {
      WebSocketLogger.instance = new WebSocketLogger();
    }
    return WebSocketLogger.instance;
  }

  log(level: 'info' | 'warn' | 'error', message: string) {
    const logEntry: WebSocketLog = {
      timestamp: Date.now(),
      level,
      message,
    };
    this.logs.push(logEntry);
    logger.log(level, `[WebSocket] ${message}`);
  }

  getLogs(): WebSocketLog[] {
    return this.logs;
  }

  getMetrics(): WebSocketMetrics {
    return {
      ...this.metrics,
      uptime: Date.now() - this.startTime,
    };
  }

  setConnectionState(state: ConnectionState) {
    this.connectionState = state;
    this.log('info', `Connection state changed to ${state}`);
  }

  getConnectionState(): ConnectionState {
    return this.connectionState;
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

  incrementReconnectAttempts() {
    this.metrics.reconnectAttempts++;
  }

  clearLogs() {
    this.logs = [];
  }

  resetMetrics() {
    this.metrics = {
      messagesSent: 0,
      messagesReceived: 0,
      latency: 0,
      uptime: 0,
      reconnectAttempts: 0,
    };
    this.startTime = Date.now();
  }
}