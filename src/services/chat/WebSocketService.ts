import { ConnectionState, ConnectionMetrics, WebSocketCallbacks } from './types/websocket';
import { WebSocketMetricsService } from './services/WebSocketMetricsService';
import { WebSocketConnectionService } from './services/WebSocketConnectionService';
import { logger } from './LoggingService';

export class WebSocketService {
  private connectionService: WebSocketConnectionService;
  private metricsService: WebSocketMetricsService;
  private sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    
    logger.info('Initializing WebSocket service', 
      { sessionId }, 
      sessionId,
      { component: 'WebSocketService', action: 'initialize' }
    );

    this.metricsService = new WebSocketMetricsService(sessionId);
    this.connectionService = new WebSocketConnectionService(
      sessionId,
      this.metricsService,
      this.handleStateChange.bind(this)
    );
  }

  private handleStateChange(state: ConnectionState) {
    logger.info(`WebSocket state changed to ${state}`,
      { 
        previousState: this.connectionService.getState(),
        newState: state,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketService', action: 'handleStateChange' }
    );
  }

  public async setCallbacks(callbacks: WebSocketCallbacks) {
    logger.debug('Setting WebSocket callbacks',
      { 
        hasMessageCallback: !!callbacks.onMessage,
        hasStateCallback: !!callbacks.onStateChange,
        hasMetricsCallback: !!callbacks.onMetricsUpdate,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketService', action: 'setCallbacks' }
    );
  }

  public async connect(accessToken: string) {
    logger.info('Initiating WebSocket connection',
      { 
        sessionId: this.sessionId,
        hasToken: !!accessToken,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketService', action: 'connect' }
    );

    try {
      this.connectionService.setAuthToken(accessToken);
      await this.connectionService.connect();
    } catch (error) {
      logger.error('Connection failed',
        { 
          error,
          timestamp: new Date().toISOString()
        },
        this.sessionId,
        { component: 'WebSocketService', action: 'connect' }
      );
      throw error;
    }
  }

  public send(message: any): boolean {
    logger.debug('Attempting to send message',
      { 
        messageType: message?.type,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketService', action: 'send' }
    );
    return this.connectionService.send(message);
  }

  public disconnect() {
    logger.info('Disconnecting WebSocket service',
      {
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketService', action: 'disconnect' }
    );
    this.connectionService.disconnect();
  }

  public getState(): ConnectionState {
    const wsState = this.connectionService.getState();
    return this.mapWebSocketState(wsState);
  }

  private mapWebSocketState(state: number): ConnectionState {
    switch (state) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'disconnected';
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'initial';
    }
  }

  public getMetrics(): ConnectionMetrics {
    return this.metricsService.getMetrics();
  }
}