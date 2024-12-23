import { ConnectionState } from '@/types/websocket';
import { WebSocketLogger } from './WebSocketLogger';
import { WebSocketStateManager } from './WebSocketStateManager';
import { WebSocketMessageHandler } from './WebSocketMessageHandler';
import { WEBSOCKET_URL } from '@/constants/websocket';

export class WebSocketConnection {
  private ws: WebSocket | null = null;
  private authToken: string | null = null;

  constructor(
    private sessionId: string,
    private logger: WebSocketLogger,
    private stateManager: WebSocketStateManager,
    private messageHandler: WebSocketMessageHandler
  ) {}

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
    this.logger.logConnectionAttempt(wsUrl, !!this.authToken);

    try {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
      
    } catch (error) {
      this.logger.logConnectionError(error as Error, this.stateManager.getReconnectAttempts());
      throw error;
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.stateManager.setState('connected');
      this.stateManager.resetReconnectAttempts();
      this.messageHandler.handleOpen();
    };

    this.ws.onmessage = (event) => {
      this.messageHandler.handleMessage(event.data);
    };

    this.ws.onerror = () => {
      this.stateManager.setState('error');
      this.messageHandler.handleError(new Error('WebSocket error occurred'));
    };

    this.ws.onclose = (event) => {
      this.stateManager.setState('disconnected');
      this.messageHandler.handleClose(event);
    };
  }

  send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
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