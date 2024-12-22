import { logger } from './LoggingService';
import { WebSocketMessageHandler } from './WebSocketMessageHandler';
import { WEBSOCKET_URL } from '@/constants/websocket';
import { ConnectionState, WebSocketCallbacks } from './types/websocket';
import { supabase } from "@/integrations/supabase/client";

export class ConnectionManager {
  private ws: WebSocket | null = null;
  private sessionId: string;
  private authToken: string | null = null;
  private messageHandler: WebSocketMessageHandler;
  private onMessageCallback: ((message: any) => void) | null = null;
  private onStateChangeCallback: ((state: ConnectionState) => void) | null = null;
  private onMetricsUpdateCallback: WebSocketCallbacks['onMetricsUpdate'] | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.messageHandler = new WebSocketMessageHandler(sessionId);
    logger.info('Connection manager initialized', 
      { 
        sessionId,
        timestamp: new Date().toISOString()
      }, 
      sessionId,
      { component: 'ConnectionManager', action: 'initialize' }
    );
  }

  setAuthToken(token: string) {
    this.authToken = token;
    logger.debug('Auth token set',
      { 
        hasToken: !!token,
        tokenLength: token.length,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'ConnectionManager', action: 'setAuthToken' }
    );
  }

  getSessionId() {
    return this.sessionId;
  }

  setCallbacks(callbacks: WebSocketCallbacks) {
    this.onMessageCallback = callbacks.onMessage;
    this.onStateChangeCallback = callbacks.onStateChange;
    this.onMetricsUpdateCallback = callbacks.onMetricsUpdate;
    logger.debug('Callbacks set for connection manager',
      { 
        hasMessageCallback: !!callbacks.onMessage,
        hasStateCallback: !!callbacks.onStateChange,
        hasMetricsCallback: !!callbacks.onMetricsUpdate,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'ConnectionManager', action: 'setCallbacks' }
    );
  }

  async connect() {
    if (!this.authToken) {
      const error = new Error('Authentication token not set');
      logger.error('Connection failed - no auth token',
        {
          timestamp: new Date().toISOString()
        },
        this.sessionId,
        { component: 'ConnectionManager', action: 'connect', error }
      );
      throw error;
    }

    try {
      if (this.ws) {
        logger.debug('Closing existing connection',
          {
            readyState: this.ws.readyState,
            timestamp: new Date().toISOString()
          },
          this.sessionId,
          { component: 'ConnectionManager', action: 'connect' }
        );
        this.ws.close();
        this.ws = null;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        const error = new Error('No valid session found');
        logger.error('Connection failed - invalid session',
          {
            timestamp: new Date().toISOString()
          },
          this.sessionId,
          { component: 'ConnectionManager', action: 'connect', error }
        );
        throw error;
      }

      const wsUrl = `${WEBSOCKET_URL}?session_id=${this.sessionId}&access_token=${session.access_token}`;
      logger.debug('Connecting to WebSocket',
        { 
          url: wsUrl.replace(session.access_token, '[REDACTED]'),
          timestamp: new Date().toISOString()
        },
        this.sessionId,
        { component: 'ConnectionManager', action: 'connect' }
      );
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onclose = this.handleClose.bind(this);

      logger.info('WebSocket connection initialized',
        {
          timestamp: new Date().toISOString()
        },
        this.sessionId,
        { component: 'ConnectionManager', action: 'connect' }
      );
      
    } catch (error) {
      logger.error('Failed to establish WebSocket connection',
        { 
          error,
          reconnectAttempts: this.reconnectAttempts,
          timestamp: new Date().toISOString()
        },
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
      {
        timestamp: new Date().toISOString()
      },
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
      { 
        data: event.data,
        timestamp: new Date().toISOString()
      },
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
      { 
        event,
        error,
        timestamp: new Date().toISOString()
      },
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
        wasClean: event.wasClean,
        timestamp: new Date().toISOString()
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
        { 
          attempts: this.reconnectAttempts,
          maxAttempts: this.maxReconnectAttempts,
          timestamp: new Date().toISOString()
        },
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
        maxAttempts: this.maxReconnectAttempts,
        timestamp: new Date().toISOString()
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
        { 
          error,
          attempt: this.reconnectAttempts,
          timestamp: new Date().toISOString()
        },
        this.sessionId,
        { component: 'ConnectionManager', action: 'handleReconnect', error: error as Error }
      );
    }
  }

  send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        logger.debug('Sending WebSocket message',
          { 
            message,
            timestamp: new Date().toISOString()
          },
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
          { 
            error,
            message,
            timestamp: new Date().toISOString()
          },
          this.sessionId,
          { component: 'ConnectionManager', action: 'send', error: error as Error }
        );
        return false;
      }
    }
    logger.warn('Cannot send message - WebSocket not connected',
      { 
        readyState: this.ws?.readyState,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'ConnectionManager', action: 'send' }
    );
    return false;
  }

  public getState(): number {
    return this.ws?.readyState ?? -1;
  }

  disconnect() {
    logger.info('Disconnecting WebSocket',
      {
        readyState: this.ws?.readyState,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'ConnectionManager', action: 'disconnect' }
    );
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

}
