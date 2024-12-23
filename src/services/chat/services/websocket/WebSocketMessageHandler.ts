import { ConnectionMetrics } from '@/types/websocket';
import { WebSocketLogger } from './WebSocketLogger';

export class WebSocketMessageHandler {
  constructor(
    private logger: WebSocketLogger,
    private onMessage?: (data: any) => void,
    private onMetricsUpdate?: (metrics: Partial<ConnectionMetrics>) => void
  ) {}

  handleOpen() {
    const metrics = {
      lastConnected: new Date(),
      reconnectAttempts: 0,
      lastError: null
    };
    
    this.logger.logConnectionSuccess(metrics);
    this.onMetricsUpdate?.(metrics);
  }

  handleMessage(data: string) {
    try {
      const parsedData = JSON.parse(data);
      this.logger.logMessageReceived(parsedData);
      this.onMessage?.(parsedData);
    } catch (error) {
      this.logger.logConnectionError(error as Error, 0);
    }
  }

  handleError(error: Error) {
    this.logger.logConnectionError(error, 0);
    this.onMetricsUpdate?.({
      lastError: error,
      lastConnected: null
    });
  }

  handleClose(event: CloseEvent) {
    this.logger.logDisconnect(event.code, event.reason);
  }
}