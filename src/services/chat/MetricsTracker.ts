import { ConnectionMetrics } from '@/types/websocket';

export class MetricsTracker {
  private metrics: ConnectionMetrics = {
    lastConnected: null,
    reconnectAttempts: 0,
    lastError: null,
    messagesSent: 0,
    messagesReceived: 0,
    lastHeartbeat: null,
    latency: 0,
    uptime: 0,
  };

  setLastConnected() {
    this.metrics.lastConnected = new Date();
  }

  setLastError(error: Error) {
    this.metrics.lastError = error;
  }

  setReconnectAttempts(attempts: number) {
    this.metrics.reconnectAttempts = attempts;
  }

  incrementMessagesSent() {
    this.metrics.messagesSent++;
  }

  incrementMessagesReceived() {
    this.metrics.messagesReceived++;
  }

  updateLastHeartbeat() {
    this.metrics.lastHeartbeat = new Date();
  }

  getMetrics(): ConnectionMetrics {
    if (this.metrics.lastConnected) {
      this.metrics.uptime = Date.now() - this.metrics.lastConnected.getTime();
    }
    return { ...this.metrics };
  }
}