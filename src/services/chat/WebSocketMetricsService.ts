import { ConnectionMetrics } from '@/types/websocket';
import { logger } from '@/services/chat/LoggingService';

export class WebSocketMetricsService {
  private metrics: ConnectionMetrics;
  private sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
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

    logger.info('WebSocket metrics service initialized', { 
      sessionId,
      component: 'WebSocketMetricsService'
    });
  }

  updateMetrics(updates: Partial<ConnectionMetrics>) {
    this.metrics = { ...this.metrics, ...updates };
    logger.debug('WebSocket metrics updated', {
      metrics: this.metrics,
      component: 'WebSocketMetricsService'
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
    logger.debug('Messages sent counter incremented', {
      total: this.metrics.messagesSent,
      component: 'WebSocketMetricsService'
    });
  }

  incrementMessagesReceived() {
    this.metrics.messagesReceived++;
    logger.debug('Messages received counter incremented', {
      total: this.metrics.messagesReceived,
      component: 'WebSocketMetricsService'
    });
  }

  recordHeartbeat() {
    this.metrics.lastHeartbeat = new Date();
    logger.debug('Heartbeat recorded', {
      timestamp: this.metrics.lastHeartbeat.toISOString(),
      component: 'WebSocketMetricsService'
    });
  }

  recordError(error: Error) {
    this.metrics.lastError = error;
    logger.error('WebSocket error recorded', {
      error,
      component: 'WebSocketMetricsService'
    });
  }
}