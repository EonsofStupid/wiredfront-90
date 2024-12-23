import { ConnectionState, ConnectionMetrics, WebSocketCallbacks } from '@/types/websocket';
import { WebSocketAuthenticator } from './WebSocketAuthenticator';
import { WebSocketReconnection } from './WebSocketReconnection';
import { WebSocketMessageHandler } from '../message/WebSocketMessageHandler';
import { WebSocketMetricsService } from '../monitoring/WebSocketMetricsService';
import { logger } from '../../LoggingService';
import { WEBSOCKET_URL } from '@/constants/websocket';
import { supabase } from "@/integrations/supabase/client";

export class WebSocketConnection {
  private ws: WebSocket | null = null;
  private authenticator: WebSocketAuthenticator;
  private reconnection: WebSocketReconnection;
  private messageHandler: WebSocketMessageHandler;
  private metricsService: WebSocketMetricsService;
  private callbacks: WebSocketCallbacks = {
    onMessage: () => {},
    onStateChange: () => {},
    onMetricsUpdate: () => {}
  };

  constructor(private sessionId: string) {
    this.authenticator = new WebSocketAuthenticator(sessionId);
    this.reconnection = new WebSocketReconnection(sessionId, this.callbacks.onStateChange);
    this.messageHandler = new WebSocketMessageHandler(sessionId, this.callbacks.onMessage);
    this.metricsService = new WebSocketMetricsService(sessionId, this.callbacks.onMetricsUpdate);
    
    logger.info('WebSocket connection initialized', {
      sessionId,
      context: { component: 'WebSocketConnection', action: 'initialize' }
    });
  }

  setCallbacks(callbacks: WebSocketCallbacks) {
    this.callbacks = callbacks;
    this.reconnection = new WebSocketReconnection(this.sessionId, callbacks.onStateChange);
    this.messageHandler = new WebSocketMessageHandler(this.sessionId, callbacks.onMessage);
    this.metricsService = new WebSocketMetricsService(this.sessionId, callbacks.onMetricsUpdate);
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

    this.ws.onopen = this.handleOpen.bind(this);
    this.ws.onmessage = this.handleMessage.bind(this);
    this.ws.onerror = this.handleError.bind(this);
    this.ws.onclose = this.handleClose.bind(this);
  }

  private handleOpen() {
    this.reconnection.resetAttempts();
    this.callbacks.onStateChange('connected');
    this.metricsService.updateMetrics({
      lastConnected: new Date(),
      reconnectAttempts: 0,
      lastError: null
    });
  }

  private handleMessage(event: MessageEvent) {
    this.messageHandler.handleMessage(event.data);
    this.metricsService.incrementMessagesReceived();
  }

  private handleError() {
    this.callbacks.onStateChange('error');
    this.metricsService.recordError(new Error('WebSocket error occurred'));
  }

  private handleClose() {
    this.callbacks.onStateChange('disconnected');
    this.handleReconnect();
  }

  private async handleReconnect() {
    if (this.ws?.readyState === WebSocket.CONNECTING) return;
    await this.reconnection.handleReconnect(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        await this.connect(session.access_token);
      }
    });
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