import { ConnectionState, ConnectionMetrics, WebSocketCallbacks } from './websocket/types/connection';
import { WebSocketConnection } from './websocket/connection/WebSocketConnection';
import { logger } from './LoggingService';

export class WebSocketService {
  private connection: WebSocketConnection;
  private callbacks: WebSocketCallbacks;

  constructor(sessionId: string) {
    logger.info('Initializing WebSocket service', 
      { sessionId }, 
      sessionId,
      { component: 'WebSocketService', action: 'initialize' }
    );

    this.callbacks = {
      onMessage: this.handleMessage.bind(this),
      onStateChange: this.handleStateChange.bind(this),
      onMetricsUpdate: this.handleMetricsUpdate.bind(this)
    };

    this.connection = new WebSocketConnection(
      sessionId,
      this.callbacks
    );
  }

  private handleStateChange(state: ConnectionState) {
    logger.info('WebSocket state changed', { state });
  }

  private handleMessage(data: any) {
    logger.debug('Message received', { data });
  }

  private handleMetricsUpdate(metrics: Partial<ConnectionMetrics>) {
    logger.debug('Metrics updated', { metrics });
  }

  public async connect(accessToken: string): Promise<void> {
    await this.connection.connect(accessToken);
  }

  public send(message: any): boolean {
    return this.connection.send(message);
  }

  public disconnect(): void {
    this.connection.disconnect();
  }

  public getState(): number {
    return this.connection.getState();
  }
}