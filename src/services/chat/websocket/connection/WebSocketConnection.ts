import { ConnectionState } from '@/types/websocket';
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

  async connect(token: string): Promise<void> {
    try {
      // First validate the session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }

      const wsUrl = `${WEBSOCKET_URL}?session_id=${this.sessionId}&access_token=${session.access_token}`;
      
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
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      await this.reconnection.attempt(() => this.connect(session.access_token));
    }
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