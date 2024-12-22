import { WebSocketLogger } from '../WebSocketLogger';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';

export class WebSocketEventEmitter {
  constructor(
    private logger: WebSocketLogger,
    private onStateChange: (state: ConnectionState) => void,
    private onMetricsUpdate: (metrics: Partial<ConnectionMetrics>) => void
  ) {}

  emitStateChange(state: ConnectionState) {
    this.onStateChange(state);
    this.logger.logStateChange('previous', state, {
      sessionId: crypto.randomUUID(),
      connectionState: state
    });
  }

  emitMetricsUpdate(metrics: Partial<ConnectionMetrics>) {
    this.onMetricsUpdate(metrics);
    this.logger.logMetricsUpdate(metrics, {
      sessionId: crypto.randomUUID(),
      metrics
    });
  }

  emitError(error: Error) {
    this.logger.logConnectionError(error, {
      sessionId: crypto.randomUUID(),
      error
    });
  }
}