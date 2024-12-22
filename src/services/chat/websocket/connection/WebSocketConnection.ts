import { WebSocketConfig, ConnectionState, WebSocketCallbacks } from '../types/connection';
import { WebSocketLogger } from '../monitoring/WebSocketLogger';
import { WebSocketAuthenticator } from './WebSocketAuthenticator';
import { WebSocketReconnection } from './WebSocketReconnection';
import { WebSocketMetrics } from '../monitoring/WebSocketMetrics';
import { WEBSOCKET_URL } from '@/constants/websocket';

export class WebSocketConnection {
  private ws: WebSocket | null = null;
  private logger: WebSocketLogger;
  private authenticator: WebSocketAuthenticator;
  private reconnection: WebSocketReconnection;
  private metrics: WebSocketMetrics;

  constructor(
    private sessionId: string,
    private callbacks: WebSocketCallbacks
  ) {
    this.logger = new WebSocketLogger(sessionId);
    this.authenticator = new WebSocketAuthenticator(sessionId);
    this.metrics = new WebSocketMetrics(sessionId, callbacks.onMetricsUpdate);
    this.reconnection = new WebSocketReconnection(
      sessionId,
      callbacks.onStateChange,
      this.connect.bind(this)
    );
  }

  async connect(accessToken: string): Promise<void> {
    try {
      const wsUrl = `${WEBSOCKET_URL}?session_id=${this.sessionId}&access_token=${accessToken}`;
      
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      this.callbacks.onStateChange('connecting');
      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
      
    } catch (error) {
      this.logger.error('Connection failed', {
        error,
        sessionId: this.sessionId,
        attempt: this.reconnection.getAttempts()
      });
      throw error;
    }
  }

  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.logger.info('Connection established', {
        sessionId: this.sessionId
      });
      this.callbacks.onStateChange('connected');
      this.metrics.recordConnection();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.metrics.incrementMessagesReceived();
        this.callbacks.onMessage(data);
      } catch (error) {
        this.logger.error('Failed to process message', {
          error,
          data: event.data
        });
      }
    };

    this.ws.onclose = () => {
      this.logger.info('Connection closed', {
        sessionId: this.sessionId
      });
      this.callbacks.onStateChange('disconnected');
      this.reconnection.handleReconnection();
    };

    this.ws.onerror = (event) => {
      const error = new Error('WebSocket error occurred');
      this.logger.error('WebSocket error', {
        error,
        sessionId: this.sessionId
      });
      this.metrics.recordError(error);
      this.callbacks.onStateChange('error');
    };
  }

  send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        this.metrics.incrementMessagesSent();
        return true;
      } catch (error) {
        this.logger.error('Failed to send message', {
          error,
          sessionId: this.sessionId
        });
        return false;
      }
    }
    return false;
  }

  disconnect(): void {
    if (this.ws) {
      this.logger.info('Disconnecting', {
        sessionId: this.sessionId
      });
      this.ws.close();
      this.ws = null;
    }
  }

  getState(): number {
    return this.ws?.readyState ?? -1;
  }
}