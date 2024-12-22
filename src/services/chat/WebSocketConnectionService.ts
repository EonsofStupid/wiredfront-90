import { ConnectionState } from '@/types/websocket';
import { WebSocketLogger } from './WebSocketLogger';
import { WebSocketAuthenticator } from './websocket/WebSocketAuthenticator';
import { WebSocketEventEmitter } from './websocket/WebSocketEventEmitter';
import { WebSocketMessageHandler } from './websocket/WebSocketMessageHandler';
import { WebSocketReconnectionManager } from './websocket/WebSocketReconnectionManager';
import { WEBSOCKET_URL } from '@/constants/websocket';
import { toast } from 'sonner';

export class WebSocketConnectionService {
  private ws: WebSocket | null = null;
  private logger: WebSocketLogger;
  private authenticator: WebSocketAuthenticator;
  private eventEmitter: WebSocketEventEmitter;
  private messageHandler: WebSocketMessageHandler | null = null;
  private reconnectionManager: WebSocketReconnectionManager;

  constructor(
    private sessionId: string,
    private metricsService: any,
    onStateChange: (state: ConnectionState) => void
  ) {
    this.logger = new WebSocketLogger(sessionId);
    this.authenticator = new WebSocketAuthenticator(this.logger, sessionId);
    this.eventEmitter = new WebSocketEventEmitter(
      this.logger,
      onStateChange,
      this.handleMetricsUpdate.bind(this)
    );
    this.reconnectionManager = new WebSocketReconnectionManager(
      this.logger,
      this.eventEmitter
    );

    this.logger.info('WebSocket service initialized', {
      sessionId,
      timestamp: new Date().toISOString()
    });
    toast.info('Chat service initialized');
  }

  async connect() {
    try {
      const token = await this.authenticator.validateSession();
      const wsUrl = `${WEBSOCKET_URL}?session_id=${this.sessionId}&access_token=${token}`;
      
      this.logger.info('Attempting connection', {
        sessionId: this.sessionId,
        url: WEBSOCKET_URL
      });
      toast.loading('Connecting to chat service...');

      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      this.ws = new WebSocket(wsUrl);
      this.messageHandler = new WebSocketMessageHandler(this.logger, this.ws, this.sessionId);
      this.setupEventHandlers();
      
    } catch (error) {
      this.logger.error('Connection failed', {
        sessionId: this.sessionId,
        error,
        attempt: this.reconnectionManager.getAttempts()
      });
      toast.error('Failed to connect to chat service');
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
    this.eventEmitter.emitStateChange('connected');
    this.reconnectionManager.resetAttempts();
    this.eventEmitter.emitMetricsUpdate({
      lastConnected: new Date(),
      reconnectAttempts: 0,
      lastError: null
    });
    toast.success('Connected to chat service');
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      this.messageHandler?.handleMessage(data);
    } catch (error) {
      this.eventEmitter.emitError(error as Error);
      toast.error('Failed to process message');
    }
  }

  private handleError() {
    this.eventEmitter.emitStateChange('error');
    toast.error('Chat connection error occurred');
  }

  private handleClose() {
    this.eventEmitter.emitStateChange('disconnected');
    this.reconnectionManager.handleReconnect(this.connect.bind(this));
    toast.info('Chat connection closed');
  }

  private handleMetricsUpdate(metrics: any) {
    this.metricsService.updateMetrics(metrics);
  }

  send(message: any): boolean {
    return this.messageHandler?.send(message) ?? false;
  }

  getState(): number {
    return this.ws?.readyState ?? -1;
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
}