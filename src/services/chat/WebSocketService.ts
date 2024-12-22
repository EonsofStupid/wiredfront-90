import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { ConnectionManager, ConnectionCallbacks } from './ConnectionManager';
import { logger } from './LoggingService';

interface WebSocketCallbacks {
  onMessage: (message: any) => void;
  onStateChange: (state: ConnectionState) => void;
  onMetricsUpdate: (metrics: Partial<ConnectionMetrics>) => void;
}

export class WebSocketService {
  private connectionManager: ConnectionManager;
  private metrics: ConnectionMetrics = {
    lastConnected: null,
    reconnectAttempts: 0,
    lastError: null,
    messagesSent: 0,
    messagesReceived: 0,
    lastHeartbeat: null,
    latency: 0,
    uptime: 0,
  };
  private sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.connectionManager = new ConnectionManager(sessionId);
    logger.info('WebSocket service initialized', 
      { sessionId }, 
      sessionId,
      { component: 'WebSocketService', action: 'initialize' }
    );
  }

  public async setCallbacks(callbacks: WebSocketCallbacks) {
    logger.debug('Setting WebSocket callbacks', 
      { hasMessageCallback: !!callbacks.onMessage },
      this.sessionId,
      { component: 'WebSocketService', action: 'setCallbacks' }
    );

    const connectionCallbacks: ConnectionCallbacks = {
      onMessage: (message) => {
        this.updateMetrics({ messagesReceived: this.metrics.messagesReceived + 1 });
        logger.debug('Message received', 
          { messageType: message?.type },
          this.sessionId,
          { component: 'WebSocketService', action: 'receiveMessage' }
        );
        callbacks.onMessage(message);
      },
      onStateChange: (state) => {
        if (state === 'connected') {
          this.updateMetrics({ 
            lastConnected: new Date(),
            reconnectAttempts: 0,
            lastError: null
          });
        }
        logger.info(`WebSocket state changed to ${state}`,
          undefined,
          this.sessionId,
          { component: 'WebSocketService', action: 'stateChange', state }
        );
        callbacks.onStateChange(state as ConnectionState);
      },
      onMetricsUpdate: callbacks.onMetricsUpdate
    };

    this.connectionManager.setCallbacks(connectionCallbacks);
  }

  private updateMetrics(updates: Partial<ConnectionMetrics>) {
    this.metrics = { ...this.metrics, ...updates };
    logger.debug('Metrics updated', 
      this.metrics,
      this.sessionId,
      { component: 'WebSocketService', action: 'updateMetrics' }
    );
  }

  public async connect(accessToken: string) {
    if (!accessToken) {
      const error = new Error('Access token is required');
      logger.error('Connection failed - no access token',
        undefined,
        this.sessionId,
        { component: 'WebSocketService', action: 'connect', error }
      );
      throw error;
    }

    try {
      logger.info('Initiating WebSocket connection',
        undefined,
        this.sessionId,
        { component: 'WebSocketService', action: 'connect' }
      );
      this.connectionManager.setAuthToken(accessToken);
      await this.connectionManager.connect();
    } catch (error) {
      this.updateMetrics({ 
        lastError: error as Error,
        reconnectAttempts: this.metrics.reconnectAttempts + 1
      });
      logger.error('Connection failed',
        { error },
        this.sessionId,
        { component: 'WebSocketService', action: 'connect', error: error as Error }
      );
      throw error;
    }
  }

  public send(message: any): boolean {
    logger.debug('Attempting to send message',
      { messageType: message?.type },
      this.sessionId,
      { component: 'WebSocketService', action: 'send' }
    );
    
    const success = this.connectionManager.send(message);
    if (success) {
      this.updateMetrics({ messagesSent: this.metrics.messagesSent + 1 });
      logger.debug('Message sent successfully',
        undefined,
        this.sessionId,
        { component: 'WebSocketService', action: 'send' }
      );
    } else {
      logger.warn('Failed to send message',
        { messageType: message?.type },
        this.sessionId,
        { component: 'WebSocketService', action: 'send' }
      );
    }
    return success;
  }

  public disconnect() {
    logger.info('Disconnecting WebSocket service',
      undefined,
      this.sessionId,
      { component: 'WebSocketService', action: 'disconnect' }
    );
    this.connectionManager.disconnect();
  }

  public getState(): ConnectionState {
    return this.connectionManager.getState() as ConnectionState;
  }

  public getMetrics(): ConnectionMetrics {
    if (this.metrics.lastConnected) {
      this.metrics.uptime = Date.now() - this.metrics.lastConnected.getTime();
    }
    return { ...this.metrics };
  }
}