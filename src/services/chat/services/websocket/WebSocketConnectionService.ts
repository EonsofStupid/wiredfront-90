import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { WebSocketLogger } from './WebSocketLogger';
import { WebSocketStateManager } from './WebSocketStateManager';
import { WebSocketEventHandler } from './WebSocketEventHandler';
import { WEBSOCKET_URL } from '@/constants/websocket';
import { toast } from 'sonner';

export class WebSocketConnectionService {
  private ws: WebSocket | null = null;
  private authToken: string | null = null;
  private logger: WebSocketLogger;
  private stateManager: WebSocketStateManager;
  private eventHandler: WebSocketEventHandler;

  constructor(
    private sessionId: string,
    private metricsService: any,
    onStateChange: (state: ConnectionState) => void
  ) {
    this.logger = new WebSocketLogger(sessionId);
    this.stateManager = new WebSocketStateManager(this.logger, onStateChange);
    this.eventHandler = new WebSocketEventHandler(
      this.logger,
      this.stateManager,
      this.handleMessage.bind(this),
      this.handleMetricsUpdate.bind(this)
    );

    this.logger.info('WebSocket service initialized', {
      sessionId,
      timestamp: new Date().toISOString()
    });
    toast.info('Chat service initialized');
  }

  setAuthToken(token: string) {
    this.authToken = token;
    this.logger.info('Auth token updated', {
      sessionId: this.sessionId,
      hasToken: !!token
    });
  }

  async connect() {
    if (!this.authToken) {
      const error = new Error('No auth token provided');
      this.logger.error('Connection failed - no auth token', {
        sessionId: this.sessionId
      });
      toast.error('Connection failed - authentication required');
      throw error;
    }

    const wsUrl = `${WEBSOCKET_URL}?session_id=${this.sessionId}&access_token=${this.authToken}`;
    this.logger.info('Attempting connection', {
      sessionId: this.sessionId,
      url: WEBSOCKET_URL
    });
    toast.loading('Connecting to chat service...');

    try {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      this.ws = new WebSocket(wsUrl);
      this.eventHandler.setupEventHandlers(this.ws);
      
      this.logger.info('WebSocket connection established', {
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      });
      toast.success('Connected to chat service');
      
    } catch (error) {
      this.logger.error('Connection failed', {
        sessionId: this.sessionId,
        error,
        attempt: this.stateManager.getReconnectAttempts()
      });
      toast.error('Failed to connect to chat service');
      throw error;
    }
  }

  private handleMessage(data: any) {
    this.logger.debug('Message received', {
      sessionId: this.sessionId,
      messageType: data?.type,
      timestamp: new Date().toISOString()
    });
    this.metricsService.incrementMessagesReceived();
  }

  private handleMetricsUpdate(metrics: Partial<ConnectionMetrics>) {
    this.metricsService.updateMetrics(metrics);
    this.logger.debug('Metrics updated', {
      sessionId: this.sessionId,
      metrics,
      timestamp: new Date().toISOString()
    });
  }

  send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        this.metricsService.incrementMessagesSent();
        this.logger.info('Message sent', {
          sessionId: this.sessionId,
          messageType: message?.type,
          timestamp: new Date().toISOString()
        });
        return true;
      } catch (error) {
        this.logger.error('Failed to send message', {
          sessionId: this.sessionId,
          error,
          messageType: message?.type
        });
        toast.error('Failed to send message');
        return false;
      }
    }
    this.logger.warn('Message not sent - connection not ready', {
      sessionId: this.sessionId,
      connectionState: this.ws?.readyState
    });
    toast.error('Cannot send message - not connected');
    return false;
  }

  disconnect() {
    if (this.ws) {
      this.logger.info('Disconnecting', {
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      });
      toast.info('Disconnecting from chat service');
      this.ws.close();
      this.ws = null;
    }
  }

  getState(): number {
    return this.ws?.readyState ?? -1;
  }
}