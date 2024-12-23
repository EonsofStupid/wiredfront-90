import { ConnectionMetrics } from '@/types/websocket';
import { logger } from '../../LoggingService';

export class WebSocketMetricsService {
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

  constructor(
    private sessionId: string,
    private onMetricsUpdate?: (metrics: Partial<ConnectionMetrics>) => void
  ) {}

  updateMetrics(updates: Partial<ConnectionMetrics>) {
    this.metrics = { ...this.metrics, ...updates };
    
    if (this.metrics.lastConnected) {
      this.metrics.uptime = Date.now() - this.metrics.lastConnected.getTime();
    }

    logger.debug('Metrics updated', {
      sessionId: this.sessionId,
      updates,
      context: { component: 'WebSocketMetricsService', action: 'updateMetrics' }
    });

    this.onMetricsUpdate?.(this.metrics);
  }

  incrementMessagesSent() {
    this.metrics.messagesSent++;
    this.updateMetrics({ messagesSent: this.metrics.messagesSent });
  }

  incrementMessagesReceived() {
    this.metrics.messagesReceived++;
    this.updateMetrics({ messagesReceived: this.metrics.messagesReceived });
  }

  recordError(error: Error) {
    this.updateMetrics({ 
      lastError: error,
      lastConnected: null
    });
  }

  getMetrics(): ConnectionMetrics {
    return { ...this.metrics };
  }
}