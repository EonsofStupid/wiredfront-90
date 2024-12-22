import { logger } from './LoggingService';
import { WebSocketMessageHandler } from './WebSocketMessageHandler';
import { WEBSOCKET_URL } from '@/constants/websocket';
import { ConnectionMetrics } from '@/types/websocket';
import { supabase } from "@/integrations/supabase/client";

export interface ConnectionCallbacks {
  onMessage: (message: any) => void;
  onStateChange: (state: string) => void;
  onMetricsUpdate: (metrics: Partial<ConnectionMetrics>) => void;
}

export class ConnectionManager {
  private ws: WebSocket | null = null;
  private sessionId: string;
  private authToken: string | null = null;
  private messageHandler: WebSocketMessageHandler;
  private onMessageCallback: ((message: any) => void) | null = null;
  private onStateChangeCallback: ((state: string) => void) | null = null;
  private onMetricsUpdateCallback: ((metrics: Partial<ConnectionMetrics>) => void) | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.messageHandler = new WebSocketMessageHandler(sessionId);
    logger.info('Connection manager initialized', { sessionId }, this.sessionId);
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  getSessionId() {
    return this.sessionId;
  }

  setCallbacks(callbacks: ConnectionCallbacks) {
    this.onMessageCallback = callbacks.onMessage;
    this.onStateChangeCallback = callbacks.onStateChange;
    this.onMetricsUpdateCallback = callbacks.onMetricsUpdate;
    logger.debug('Callbacks set for connection manager', undefined, this.sessionId);
  }

  async connect() {
    if (!this.authToken) {
      logger.error('Authentication token not set', {}, this.sessionId);
      throw new Error('Authentication token not set');
    }

    try {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      // Get a fresh session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }

      const wsUrl = `${WEBSOCKET_URL}?session_id=${this.sessionId}&access_token=${session.access_token}`;
      logger.debug('Connecting to WebSocket', { url: wsUrl.replace(session.access_token, '[REDACTED]') }, this.sessionId);
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      
    } catch (error) {
      logger.error('Failed to establish WebSocket connection', { error }, this.sessionId);
      this.handleReconnect();
      throw error;
    }
  }

  private handleOpen() {
    this.reconnectAttempts = 0;
    logger.info('WebSocket connection established', undefined, this.sessionId);
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback('connected');
    }
    if (this.onMetricsUpdateCallback) {
      this.onMetricsUpdateCallback({ 
        lastConnected: new Date(),
        reconnectAttempts: this.reconnectAttempts
      });
    }
  }

  private handleMessage(event: MessageEvent) {
    if (this.onMessageCallback) {
      this.messageHandler.handleMessage(event.data, this.onMessageCallback);
    }
    if (this.onMetricsUpdateCallback) {
      this.onMetricsUpdateCallback({ messagesReceived: 1 });
    }
  }

  private handleError(event: Event) {
    logger.error('WebSocket connection error', { event }, this.sessionId);
    this.messageHandler.handleError(new Error('WebSocket connection error'));
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback('error');
    }
    if (this.onMetricsUpdateCallback) {
      this.onMetricsUpdateCallback({ 
        lastError: new Error('WebSocket connection error'),
        reconnectAttempts: this.reconnectAttempts
      });
    }
    this.handleReconnect();
  }

  private handleClose(event: CloseEvent) {
    logger.info('WebSocket connection closed', {
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean
    }, this.sessionId);
    
    this.messageHandler.handleClose(event);
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback('disconnected');
    }
    this.handleReconnect();
  }

  private async handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error('Max reconnection attempts reached', {
        attempts: this.reconnectAttempts
      }, this.sessionId);
      if (this.onStateChangeCallback) {
        this.onStateChangeCallback('failed');
      }
      return;
    }

    this.reconnectAttempts++;
    logger.info('Attempting to reconnect', {
      attempt: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts
    }, this.sessionId);

    if (this.onStateChangeCallback) {
      this.onStateChangeCallback('reconnecting');
    }

    // Exponential backoff
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      await this.connect();
    } catch (error) {
      logger.error('Reconnection attempt failed', { error }, this.sessionId);
    }
  }

  send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        logger.debug('Sending WebSocket message', { message }, this.sessionId);
        this.ws.send(JSON.stringify(message));
        if (this.onMetricsUpdateCallback) {
          this.onMetricsUpdateCallback({ messagesSent: 1 });
        }
        return true;
      } catch (error) {
        logger.error('Failed to send WebSocket message', { error, message }, this.sessionId);
        return false;
      }
    }
    logger.warn('Cannot send message - WebSocket not connected', { readyState: this.ws?.readyState }, this.sessionId);
    return false;
  }

  disconnect() {
    logger.info('Disconnecting WebSocket', undefined, this.sessionId);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  getState(): string {
    if (!this.ws) return 'initial';
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'error';
    }
  }
}