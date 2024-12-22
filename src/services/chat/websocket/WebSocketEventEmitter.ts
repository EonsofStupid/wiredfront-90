import { WebSocketLogger } from '../WebSocketLogger';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { toast } from 'sonner';

export class WebSocketEventEmitter {
  constructor(
    private logger: WebSocketLogger,
    private onStateChange: (state: ConnectionState) => void,
    private onMetricsUpdate: (metrics: Partial<ConnectionMetrics>) => void
  ) {}

  emitStateChange(state: ConnectionState) {
    this.onStateChange(state);
    this.logger.logStateChange(state, {
      sessionId: crypto.randomUUID()
    });
    
    // User feedback
    switch (state) {
      case 'connecting':
        toast.loading('Connecting to chat service...');
        break;
      case 'connected':
        toast.success('Connected to chat service');
        break;
      case 'disconnected':
        toast.error('Disconnected from chat service');
        break;
      case 'error':
        toast.error('Chat connection error occurred');
        break;
      case 'reconnecting':
        toast.loading('Attempting to reconnect...');
        break;
    }
  }

  emitMetricsUpdate(metrics: Partial<ConnectionMetrics>) {
    this.onMetricsUpdate(metrics);
    this.logger.logMetricsUpdate({
      lastConnected: metrics.lastConnected || null,
      reconnectAttempts: metrics.reconnectAttempts || 0,
      lastError: metrics.lastError || null,
      messagesSent: metrics.messagesSent || 0,
      messagesReceived: metrics.messagesReceived || 0,
      lastHeartbeat: metrics.lastHeartbeat || null,
      latency: metrics.latency || 0,
      uptime: metrics.uptime || 0
    });
  }

  emitError(error: Error) {
    this.logger.logConnectionError(error, {
      sessionId: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    });
    toast.error(`Connection error: ${error.message}`);
  }
}