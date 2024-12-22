import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { WebSocketLogger } from './websocket/WebSocketLogger';
import { WebSocketStateManager } from './websocket/WebSocketStateManager';
import { WebSocketEventHandler } from './websocket/WebSocketEventHandler';
import { WEBSOCKET_URL } from '@/constants/websocket';

export class WebSocketConnectionService {
  private ws: WebSocket | null = null;
  private authToken: string | null = null;
  private logger: WebSocketLogger;
  private stateManager: WebSocketStateManager;
  private eventHandler: WebSocketEventHandler;

  constructor(
    private sessionId: string,
    private metricsService: any,
    onStateChange: (state: ConnectionState) => void
  ) {
    this.logger = new WebSocketLogger(sessionId);
    this.stateManager = new WebSocketStateManager(this.logger, onStateChange);
    this.eventHandler = new WebSocketEventHandler(
      this.logger,
      this.stateManager,
      this.handleMessage.bind(this),
      this.handleMetricsUpdate.bind(this)
    );
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  async connect() {
    if (!this.authToken) {
      const error = new Error('No auth token provided');
      this.logger.logConnectionError(error, 0);
      throw error;
    }

    const wsUrl = `${WEBSOCKET_URL}?session_id=${this.sessionId}&access_token=${this.authToken}`;
    this.logger.logConnectionAttempt(WEBSOCKET_URL, !!this.authToken);

    try {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      this.ws = new WebSocket(wsUrl);
      this.eventHandler.setupEventHandlers(this.ws);
      
    } catch (error) {
      this.logger.logConnectionError(error as Error, this.stateManager.getReconnectAttempts());
      throw error;
    }
  }

  private handleMessage(data: any) {
    // Handle incoming messages
    this.metricsService.incrementMessagesReceived();
  }

  private handleMetricsUpdate(metrics: Partial<ConnectionMetrics>) {
    this.metricsService.updateMetrics(metrics);
  }

  send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        this.metricsService.incrementMessagesSent();
        this.logger.logMessageSent(message?.type, true);
        return true;
      } catch (error) {
        this.logger.logConnectionError(error as Error, this.stateManager.getReconnectAttempts());
        return false;
      }
    }
    this.logger.logMessageSent(message?.type, false);
    return false;
  }

  disconnect() {
    if (this.ws) {
      this.logger.logDisconnect();
      this.ws.close();
      this.ws = null;
    }
  }

  getState(): number {
    return this.ws?.readyState ?? -1;
  }
}