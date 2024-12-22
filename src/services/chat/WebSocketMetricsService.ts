import { ConnectionMetrics } from '@/types/websocket';
import { WebSocketLogger } from './WebSocketLogger';

export class WebSocketMetricsService {
  private metrics: ConnectionMetrics;
  private logger: WebSocketLogger;

  constructor(sessionId: string) {
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
    this.logger.logMetricsUpdate(this.metrics, {
      sessionId: crypto.randomUUID(),
      metrics: updates
    });
  }

  getMetrics(): ConnectionMetrics {
    if (this.metrics.lastConnected) {
      this.metrics.uptime = Date.now() - this.metrics.lastConnected.getTime();
    }
    return { ...this.metrics };
  }

  incrementMessagesSent() {
    this.metrics.messagesSent++;
    this.logger.logMetricsUpdate(this.metrics, {
      sessionId: crypto.randomUUID(),
      metrics: { messagesSent: this.metrics.messagesSent }
    });
  }

  incrementMessagesReceived() {
    this.metrics.messagesReceived++;
    this.logger.logMetricsUpdate(this.metrics, {
      sessionId: crypto.randomUUID(),
      metrics: { messagesReceived: this.metrics.messagesReceived }
    });
  }

  recordHeartbeat() {
    this.metrics.lastHeartbeat = new Date();
    this.logger.logMetricsUpdate(this.metrics, {
      sessionId: crypto.randomUUID(),
      metrics: { lastHeartbeat: this.metrics.lastHeartbeat }
    });
  }

  recordError(error: Error) {
    this.metrics.lastError = error;
    this.logger.logMetricsUpdate(this.metrics, {
      sessionId: crypto.randomUUID(),
      metrics: { lastError: this.metrics.lastError }
    });
  }

  recordLatency(startTime: number) {
    this.metrics.latency = Date.now() - startTime;
    this.logger.logMetricsUpdate(this.metrics, {
      sessionId: crypto.randomUUID(),
      metrics: { latency: this.metrics.latency }
    });
  }
}