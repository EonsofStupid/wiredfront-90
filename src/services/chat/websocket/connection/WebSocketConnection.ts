import { ConnectionState, ConnectionMetrics, WebSocketCallbacks } from '@/types/websocket';
import { WebSocketAuthenticator } from './WebSocketAuthenticator';
import { WebSocketReconnection } from './WebSocketReconnection';
import { WebSocketMessageHandler } from '../message/WebSocketMessageHandler';
import { WebSocketMetricsService } from '../monitoring/WebSocketMetricsService';
import { logger } from '../../LoggingService';
import { WEBSOCKET_URL } from '@/constants/websocket';

export class WebSocketConnection {
  private ws: WebSocket | null = null;
  private authenticator: WebSocketAuthenticator;
  private reconnection: WebSocketReconnection;
  private messageHandler: WebSocketMessageHandler;
  private metricsService: WebSocketMetricsService;

  constructor(private sessionId: string) {
    this.authenticator = new WebSocketAuthenticator(sessionId);
    this.reconnection = new WebSocketReconnection(sessionId);
    this.messageHandler = new WebSocketMessageHandler(sessionId);
    this.metricsService = new WebSocketMetricsService(sessionId);
    
    logger.info('WebSocket connection initialized', {
      sessionId,
      context: { component: 'WebSocketConnection', action: 'initialize' }
    });
  }

  setCallbacks(callbacks: WebSocketCallbacks) {
    this.messageHandler.setCallback(callbacks.onMessage);
    this.reconnection.setStateCallback(callbacks.onStateChange);
    this.metricsService.setCallback(callbacks.onMetricsUpdate);
  }

  async connect(token: string): Promise<void> {
    try {
      const { isValid } = await this.authenticator.validateSession(token);
      if (!isValid) {
        throw new Error('Invalid session');
      }

      const wsUrl = `${WEBSOCKET_URL}?session_id=${this.sessionId}&access_token=${token}`;
      
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
      
    } catch (error) {
      logger.error('Connection failed', {
        error,
        sessionId: this.sessionId,
        context: { component: 'WebSocketConnection', action: 'connect' }
      });
      throw error;
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.reconnection.resetAttempts();
      this.metricsService.updateMetrics({
        lastConnected: new Date(),
        reconnectAttempts: 0,
        lastError: null
      });
    };

    this.ws.onmessage = (event) => {
      this.messageHandler.handleMessage(event.data);
      this.metricsService.incrementMessagesReceived();
    };

    this.ws.onerror = () => {
      this.metricsService.recordError(new Error('WebSocket error occurred'));
    };

    this.ws.onclose = () => {
      this.handleReconnect();
    };
  }

  private async handleReconnect() {
    await this.reconnection.attempt(() => this.connect(this.authenticator.getToken()));
  }

  send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        this.metricsService.incrementMessagesSent();
        return true;
      } catch (error) {
        logger.error('Failed to send message', {
          error,
          sessionId: this.sessionId,
          context: { component: 'WebSocketConnection', action: 'send' }
        });
        return false;
      }
    }
    return false;
  }

  disconnect() {
    if (this.ws) {
      logger.info('Disconnecting WebSocket', {
        sessionId: this.sessionId,
        context: { component: 'WebSocketConnection', action: 'disconnect' }
      });
      this.ws.close();
      this.ws = null;
    }
  }
}