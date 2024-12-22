import { ConnectionState } from '../types/websocket';
import { logger } from '../LoggingService';
import { WebSocketMetricsService } from './WebSocketMetricsService';
import { WEBSOCKET_URL } from '@/constants/websocket';

export class WebSocketConnectionService {
  private ws: WebSocket | null = null;
  private sessionId: string;
  private metricsService: WebSocketMetricsService;
  private authToken: string | null = null;
  private onStateChange: (state: ConnectionState) => void;
  private connectionAttempts: number = 0;

  constructor(
    sessionId: string, 
    metricsService: WebSocketMetricsService,
    onStateChange: (state: ConnectionState) => void
  ) {
    this.sessionId = sessionId;
    this.metricsService = metricsService;
    this.onStateChange = onStateChange;

    logger.info('WebSocket connection service initialized',
      { 
        sessionId,
        timestamp: new Date().toISOString(),
        connectionAttempts: this.connectionAttempts
      },
      sessionId,
      { component: 'WebSocketConnectionService', action: 'initialize' }
    );
  }

  setAuthToken(token: string) {
    logger.debug('Setting auth token',
      { 
        hasToken: !!token,
        tokenLength: token.length,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId
      },
      this.sessionId,
      { component: 'WebSocketConnectionService', action: 'setAuthToken' }
    );
    this.authToken = token;
  }

  async connect() {
    if (!this.authToken) {
      const error = new Error('No auth token provided');
      logger.error('Connection failed - missing auth token',
        { 
          error,
          timestamp: new Date().toISOString(),
          sessionId: this.sessionId,
          connectionAttempts: this.connectionAttempts
        },
        this.sessionId,
        { component: 'WebSocketConnectionService', action: 'connect' }
      );
      throw error;
    }

    const wsUrl = `${WEBSOCKET_URL}?session_id=${this.sessionId}&access_token=${this.authToken}`;
    
    logger.info('Initiating WebSocket connection',
      { 
        url: WEBSOCKET_URL,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        connectionAttempts: this.connectionAttempts,
        wsState: this.ws?.readyState
      },
      this.sessionId,
      { component: 'WebSocketConnectionService', action: 'connect' }
    );

    try {
      if (this.ws) {
        logger.info('Closing existing connection before reconnect',
          {
            previousState: this.ws.readyState,
            sessionId: this.sessionId,
            timestamp: new Date().toISOString()
          },
          this.sessionId,
          { component: 'WebSocketConnectionService', action: 'connect' }
        );
        this.ws.close();
        this.ws = null;
      }

      this.connectionAttempts++;
      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
      
      logger.info('WebSocket connection attempt completed',
        { 
          timestamp: new Date().toISOString(),
          sessionId: this.sessionId,
          attempt: this.connectionAttempts,
          wsState: this.ws.readyState
        },
        this.sessionId,
        { component: 'WebSocketConnectionService', action: 'connect' }
      );
    } catch (error) {
      logger.error('Failed to establish WebSocket connection',
        { 
          error,
          timestamp: new Date().toISOString(),
          sessionId: this.sessionId,
          connectionAttempts: this.connectionAttempts,
          wsUrl: wsUrl.replace(this.authToken, '[REDACTED]')
        },
        this.sessionId,
        { component: 'WebSocketConnectionService', action: 'connect' }
      );
      throw error;
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      logger.info('WebSocket connection opened',
        { 
          timestamp: new Date().toISOString(),
          sessionId: this.sessionId,
          connectionAttempts: this.connectionAttempts,
          wsState: this.ws?.readyState
        },
        this.sessionId,
        { component: 'WebSocketConnectionService', action: 'onOpen' }
      );
      this.onStateChange('connected');
      this.metricsService.updateMetrics({ 
        lastConnected: new Date(),
        reconnectAttempts: this.connectionAttempts
      });
    };

    this.ws.onclose = (event) => {
      logger.info('WebSocket connection closed',
        { 
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          timestamp: new Date().toISOString(),
          sessionId: this.sessionId,
          connectionAttempts: this.connectionAttempts
        },
        this.sessionId,
        { component: 'WebSocketConnectionService', action: 'onClose' }
      );
      this.onStateChange('disconnected');
    };

    this.ws.onerror = (error) => {
      logger.error('WebSocket connection error',
        { 
          error,
          timestamp: new Date().toISOString(),
          sessionId: this.sessionId,
          connectionAttempts: this.connectionAttempts,
          wsState: this.ws?.readyState
        },
        this.sessionId,
        { component: 'WebSocketConnectionService', action: 'onError' }
      );
      this.onStateChange('error');
      this.metricsService.recordError(error instanceof Error ? error : new Error('WebSocket error'));
    };

    this.ws.onmessage = (event) => {
      logger.debug('WebSocket message received',
        {
          data: event.data,
          timestamp: new Date().toISOString(),
          sessionId: this.sessionId
        },
        this.sessionId,
        { component: 'WebSocketConnectionService', action: 'onMessage' }
      );
    };
  }

  send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        this.metricsService.incrementMessagesSent();
        logger.debug('Message sent successfully',
          { 
            messageType: message?.type,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            wsState: this.ws.readyState
          },
          this.sessionId,
          { component: 'WebSocketConnectionService', action: 'send' }
        );
        return true;
      } catch (error) {
        logger.error('Failed to send message',
          { 
            error,
            message,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            wsState: this.ws.readyState
          },
          this.sessionId,
          { component: 'WebSocketConnectionService', action: 'send' }
        );
        return false;
      }
    }
    logger.warn('Cannot send message - connection not open',
      { 
        readyState: this.ws?.readyState,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId
      },
      this.sessionId,
      { component: 'WebSocketConnectionService', action: 'send' }
    );
    return false;
  }

  disconnect() {
    logger.info('Disconnecting WebSocket',
      { 
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
        wsState: this.ws?.readyState,
        connectionAttempts: this.connectionAttempts
      },
      this.sessionId,
      { component: 'WebSocketConnectionService', action: 'disconnect' }
    );
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  getState(): number {
    return this.ws?.readyState ?? -1;
  }
}