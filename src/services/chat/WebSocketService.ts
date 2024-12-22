import { ConnectionState, ConnectionMetrics, WebSocketCallbacks } from './types/websocket';
import { WebSocketLogger } from './services/websocket/WebSocketLogger';
import { WebSocketStateManager } from './services/websocket/WebSocketStateManager';
import { WebSocketConnection } from './services/websocket/WebSocketConnection';
import { WebSocketMessageHandler } from './services/websocket/WebSocketMessageHandler';

export class WebSocketService {
  private connection: WebSocketConnection;
  private logger: WebSocketLogger;
  private stateManager: WebSocketStateManager;
  private messageHandler: WebSocketMessageHandler;

  constructor(private sessionId: string) {
    this.logger = new WebSocketLogger(sessionId);
    this.stateManager = new WebSocketStateManager(this.logger);
    this.messageHandler = new WebSocketMessageHandler(
      this.logger,
      this.handleMessage.bind(this),
      this.handleMetricsUpdate.bind(this)
    );
    this.connection = new WebSocketConnection(
      sessionId,
      this.logger,
      this.stateManager,
      this.messageHandler
    );
  }

  private handleMessage(data: any) {
    console.log('WebSocket message received:', data);
  }

  private handleMetricsUpdate(metrics: Partial<ConnectionMetrics>) {
    console.log('WebSocket metrics updated:', metrics);
  }

  public async setCallbacks(callbacks: WebSocketCallbacks) {
    this.messageHandler = new WebSocketMessageHandler(
      this.logger,
      callbacks.onMessage,
      callbacks.onMetricsUpdate
    );
  }

  public async connect(accessToken: string) {
    try {
      this.connection.setAuthToken(accessToken);
      await this.connection.connect();
    } catch (error) {
      console.error('Failed to connect:', error);
      throw error;
    }
  }

  public send(message: any): boolean {
    return this.connection.send(message);
  }

  public disconnect() {
    this.connection.disconnect();
  }

  public getState(): ConnectionState {
    const wsState = this.connection.getState();
    switch (wsState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'disconnected';
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'initial';
    }
  }
}