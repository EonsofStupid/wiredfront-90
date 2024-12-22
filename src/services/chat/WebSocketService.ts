import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { WebSocketConnection } from './websocket/core/WebSocketConnection';
import { useWebSocketStore } from '@/stores/websocket/store';
import { logger } from './LoggingService';

export class WebSocketService {
  private connection: WebSocketConnection;

  constructor(sessionId: string) {
    logger.info('Initializing WebSocket service', 
      { sessionId }, 
      sessionId,
      { component: 'WebSocketService', action: 'initialize' }
    );

    this.connection = new WebSocketConnection(
      sessionId,
      this.handleMetricsUpdate.bind(this),
      this.handleStateChange.bind(this),
      this.handleMessage.bind(this),
      this.handleMetricsUpdate.bind(this)
    );
  }

  private handleStateChange(state: ConnectionState) {
    useWebSocketStore.getState().setConnectionState(state);
  }

  private handleMessage(data: any) {
    useWebSocketStore.getState().addMessage(data);
  }

  private handleMetricsUpdate(metrics: Partial<ConnectionMetrics>) {
    useWebSocketStore.getState().updateMetrics(metrics);
  }

  public async connect(accessToken: string): Promise<void> {
    await this.connection.connect();
  }

  public send(message: any): boolean {
    return this.connection.send(message);
  }

  public disconnect(): void {
    this.connection.disconnect();
  }

  public getState(): ConnectionState {
    return useWebSocketStore.getState().connectionState;
  }
}