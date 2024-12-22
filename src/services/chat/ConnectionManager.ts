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
    logger.info('Connection manager initialized', 
      { sessionId }, 
      sessionId,
      { component: 'ConnectionManager', action: 'initialize' }
    );
  }

  setAuthToken(token: string) {
    this.authToken = token;
    logger.debug('Auth token set',
      undefined,
      this.sessionId,
      { component: 'ConnectionManager', action: 'setAuthToken' }
    );
  }

  getSessionId() {
    return this.sessionId;
  }

  setCallbacks(callbacks: ConnectionCallbacks) {
    this.onMessageCallback = callbacks.onMessage;
    this.onStateChangeCallback = callbacks.onStateChange;
    this.onMetricsUpdateCallback = callbacks.onMetricsUpdate;
    logger.debug('Callbacks set for connection manager',
      undefined,
      this.sessionId,
      { component: 'ConnectionManager', action: 'setCallbacks' }
    );
  }

  async connect() {
    if (!this.authToken) {
      const error = new Error('Authentication token not set');
      logger.error('Connection failed - no auth token',
        undefined,
        this.sessionId,
        { component: 'ConnectionManager', action: 'connect', error }
      );
      throw error;
    }

    try {
      if (this.ws) {
        logger.debug('Closing existing connection',
          undefined,
          this.sessionId,
          { component: 'ConnectionManager', action: 'connect' }
        );
        this.ws.close();
        this.ws = null;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }

      const wsUrl = `${WEBSOCKET_URL}?session_id=${this.sessionId}&access_token=${session.access_token}`;
      logger.debug('Connecting to WebSocket',
        { url: wsUrl.replace(session.access_token, '[REDACTED]') },
        this.sessionId,
        { component: 'ConnectionManager', action: 'connect' }
      );
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      
    } catch (error) {
      logger.error('Failed to establish WebSocket connection',
        { error },
        this.sessionId,
        { component: 'ConnectionManager', action: 'connect', error: error as Error }
      );
      this.handleReconnect();
      throw error;
    }
  }

  private handleOpen() {
    this.reconnectAttempts = 0;
    logger.info('WebSocket connection established',
      undefined,
      this.sessionId,
      { component: 'ConnectionManager', action: 'handleOpen' }
    );
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
    logger.debug('Received WebSocket message',
      { data: event.data },
      this.sessionId,
      { component: 'ConnectionManager', action: 'handleMessage' }
    );
    if (this.onMessageCallback) {
      this.messageHandler.handleMessage(event.data, this.onMessageCallback);
    }
    if (this.onMetricsUpdateCallback) {
      this.onMetricsUpdateCallback({ messagesReceived: 1 });
    }
  }

  private handleError(event: Event) {
    const error = new Error('WebSocket connection error');
    logger.error('WebSocket connection error',
      { event },
      this.sessionId,
      { component: 'ConnectionManager', action: 'handleError', error }
    );
    this.messageHandler.handleError(error);
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback('error');
    }
    if (this.onMetricsUpdateCallback) {
      this.onMetricsUpdateCallback({ 
        lastError: error,
        reconnectAttempts: this.reconnectAttempts
      });
    }
    this.handleReconnect();
  }

  private handleClose(event: CloseEvent) {
    logger.info('WebSocket connection closed',
      {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean
      },
      this.sessionId,
      { component: 'ConnectionManager', action: 'handleClose' }
    );
    
    this.messageHandler.handleClose(event);
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback('disconnected');
    }
    this.handleReconnect();
  }

  private async handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error('Max reconnection attempts reached',
        { attempts: this.reconnectAttempts },
        this.sessionId,
        { component: 'ConnectionManager', action: 'handleReconnect' }
      );
      if (this.onStateChangeCallback) {
        this.onStateChangeCallback('failed');
      }
      return;
    }

    this.reconnectAttempts++;
    logger.info('Attempting to reconnect',
      {
        attempt: this.reconnectAttempts,
        maxAttempts: this.maxReconnectAttempts
      },
      this.sessionId,
      { component: 'ConnectionManager', action: 'handleReconnect' }
    );

    if (this.onStateChangeCallback) {
      this.onStateChangeCallback('reconnecting');
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      await this.connect();
    } catch (error) {
      logger.error('Reconnection attempt failed',
        { error },
        this.sessionId,
        { component: 'ConnectionManager', action: 'handleReconnect', error: error as Error }
      );
    }
  }

  send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        logger.debug('Sending WebSocket message',
          { message },
          this.sessionId,
          { component: 'ConnectionManager', action: 'send' }
        );
        this.ws.send(JSON.stringify(message));
        if (this.onMetricsUpdateCallback) {
          this.onMetricsUpdateCallback({ messagesSent: 1 });
        }
        return true;
      } catch (error) {
        logger.error('Failed to send WebSocket message',
          { error, message },
          this.sessionId,
          { component: 'ConnectionManager', action: 'send', error: error as Error }
        );
        return false;
      }
    }
    logger.warn('Cannot send message - WebSocket not connected',
      { readyState: this.ws?.readyState },
      this.sessionId,
      { component: 'ConnectionManager', action: 'send' }
    );
    return false;
  }

  disconnect() {
    logger.info('Disconnecting WebSocket',
      undefined,
      this.sessionId,
      { component: 'ConnectionManager', action: 'disconnect' }
    );
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