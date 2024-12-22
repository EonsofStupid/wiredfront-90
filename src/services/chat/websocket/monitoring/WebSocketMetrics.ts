import { ConnectionMetrics } from '../types/connection';
import { WebSocketLogger } from './WebSocketLogger';

export class WebSocketMetrics {
  private metrics: ConnectionMetrics;
  private logger: WebSocketLogger;

  constructor(
    private sessionId: string,
    private onMetricsUpdate: (metrics: Partial<ConnectionMetrics>) => void
  ) {
    this.logger = new WebSocketLogger(sessionId);
    this.metrics = {
      lastConnected: null,
      reconnectAttempts: 0,
      lastError: null,
      messagesSent: 0,
      messagesReceived: 0,
      lastHeartbeat: null,
      latency: 0,
      uptime: 0
    };
  }

  updateMetrics(updates: Partial<ConnectionMetrics>) {
    this.metrics = { ...this.metrics, ...updates };
    this.onMetricsUpdate(updates);
    this.logger.debug('Metrics updated', { updates });
  }

  getMetrics(): ConnectionMetrics {
    return { ...this.metrics };
  }

  incrementMessagesSent() {
    this.updateMetrics({
      messagesSent: this.metrics.messagesSent + 1
    });
  }

  incrementMessagesReceived() {
    this.updateMetrics({
      messagesReceived: this.metrics.messagesReceived + 1
    });
  }

  recordHeartbeat() {
    this.updateMetrics({
      lastHeartbeat: new Date()
    });
  }

  recordError(error: Error) {
    this.updateMetrics({
      lastError: error
    });
  }

  recordConnection() {
    this.updateMetrics({
      lastConnected: new Date(),
      reconnectAttempts: 0
    });
  }

  incrementReconnectAttempts() {
    this.updateMetrics({
      reconnectAttempts: this.metrics.reconnectAttempts + 1
    });
  }
}