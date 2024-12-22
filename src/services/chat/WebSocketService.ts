import { ConnectionState, ConnectionMetrics, WebSocketCallbacks } from './types/websocket';
import { WebSocketMetricsService } from './services/WebSocketMetricsService';
import { WebSocketConnectionService } from './services/WebSocketConnectionService';
import { logger } from './LoggingService';
import { useWebSocketStore } from '@/stores/websocket/store';

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
    useWebSocketStore.getState().setConnectionState(state);
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

  private handleMetricsUpdate(metrics: Partial<ConnectionMetrics>) {
    useWebSocketStore.getState().updateMetrics(metrics);
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
      useWebSocketStore.getState().setError(error as Error);
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

    const success = this.connectionService.send(message);
    
    if (success) {
      useWebSocketStore.getState().updateMetrics({
        messagesSent: (useWebSocketStore.getState().metrics.messagesSent || 0) + 1
      });
    } else {
      useWebSocketStore.getState().setError(new Error('Failed to send message'));
    }

    return success;
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
    useWebSocketStore.getState().setConnectionState('disconnected');
  }

  public getState(): ConnectionState {
    return useWebSocketStore.getState().connectionState;
  }

  public getMetrics(): ConnectionMetrics {
    return useWebSocketStore.getState().metrics;
  }
}