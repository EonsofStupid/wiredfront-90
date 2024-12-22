import { logger } from './LoggingService';
import { WebSocketMessageHandler } from './WebSocketMessageHandler';
import { WEBSOCKET_URL } from '@/constants/websocket';
import { supabase } from "@/integrations/supabase/client";

export class ConnectionManager {
  private ws: WebSocket | null = null;
  private sessionId: string;
  private messageHandler: WebSocketMessageHandler;
  private onMessageCallback: ((message: any) => void) | null = null;
  private onStateChangeCallback: ((state: string) => void) | null = null;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.messageHandler = new WebSocketMessageHandler(sessionId);
    logger.info('Connection manager initialized', { sessionId }, this.sessionId);
  }

  setCallbacks(callbacks: {
    onMessage: (message: any) => void;
    onStateChange: (state: string) => void;
  }) {
    this.onMessageCallback = callbacks.onMessage;
    this.onStateChangeCallback = callbacks.onStateChange;
    logger.debug('Callbacks set for connection manager', undefined, this.sessionId);
  }

  async connect() {
    try {
      logger.info('Initiating WebSocket connection', undefined, this.sessionId);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
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
      throw error;
    }
  }

  private handleOpen() {
    logger.info('WebSocket connection established', undefined, this.sessionId);
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback('connected');
    }
  }

  private handleMessage(event: MessageEvent) {
    if (this.onMessageCallback) {
      this.messageHandler.handleMessage(event.data, this.onMessageCallback);
    }
  }

  private handleError(event: Event) {
    this.messageHandler.handleError(new Error('WebSocket connection error'));
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback('error');
    }
  }

  private handleClose(event: CloseEvent) {
    this.messageHandler.handleClose(event);
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback('disconnected');
    }
  }

  send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        logger.debug('Sending WebSocket message', { message }, this.sessionId);
        this.ws.send(JSON.stringify(message));
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