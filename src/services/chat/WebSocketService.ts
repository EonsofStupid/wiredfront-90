import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { ConnectionManager } from './ConnectionManager';
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
    logger.info('Initializing WebSocket service', 
      { sessionId }, 
      sessionId,
      { component: 'WebSocketService', action: 'initialize' }
    );
    this.connectionManager = new ConnectionManager(sessionId);
  }

  public async setCallbacks(callbacks: WebSocketCallbacks) {
    logger.debug('Setting WebSocket callbacks', 
      { 
        hasMessageCallback: !!callbacks.onMessage,
        hasStateCallback: !!callbacks.onStateChange,
        hasMetricsCallback: !!callbacks.onMetricsUpdate
      },
      this.sessionId,
      { component: 'WebSocketService', action: 'setCallbacks' }
    );

    const connectionCallbacks = {
      onMessage: (message: any) => {
        this.updateMetrics({ messagesReceived: this.metrics.messagesReceived + 1 });
        logger.debug('Message received', 
          { 
            messageType: message?.type,
            messageId: message?.id,
            timestamp: new Date().toISOString()
          },
          this.sessionId,
          { component: 'WebSocketService', action: 'receiveMessage' }
        );
        callbacks.onMessage(message);
      },
      onStateChange: (state: ConnectionState) => {
        logger.info(`WebSocket state changed to ${state}`,
          { 
            previousState: this.connectionManager.getState(),
            newState: state,
            timestamp: new Date().toISOString()
          },
          this.sessionId,
          { component: 'WebSocketService', action: 'stateChange', state }
        );
        
        if (state === 'connected') {
          this.updateMetrics({ 
            lastConnected: new Date(),
            reconnectAttempts: 0,
            lastError: null
          });
        }
        callbacks.onStateChange(state);
      },
      onMetricsUpdate: callbacks.onMetricsUpdate
    };

    this.connectionManager.setCallbacks(connectionCallbacks);
  }

  private updateMetrics(updates: Partial<ConnectionMetrics>) {
    this.metrics = { ...this.metrics, ...updates };
    logger.debug('Metrics updated', 
      {
        metrics: this.metrics,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketService', action: 'updateMetrics' }
    );
  }

  public async connect(accessToken: string) {
    logger.info('Initiating WebSocket connection',
      { 
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketService', action: 'connect' }
    );

    if (!accessToken) {
      const error = new Error('Access token is required');
      logger.error('Connection failed - no access token',
        { 
          error,
          timestamp: new Date().toISOString()
        },
        this.sessionId,
        { component: 'WebSocketService', action: 'connect', error }
      );
      throw error;
    }

    try {
      logger.debug('Setting auth token and attempting connection',
        { 
          hasToken: !!accessToken,
          tokenLength: accessToken.length,
          timestamp: new Date().toISOString()
        },
        this.sessionId,
        { component: 'WebSocketService', action: 'connect' }
      );
      
      this.connectionManager.setAuthToken(accessToken);
      await this.connectionManager.connect();
      
      logger.info('Connection attempt completed',
        { 
          state: this.connectionManager.getState(),
          timestamp: new Date().toISOString()
        },
        this.sessionId,
        { component: 'WebSocketService', action: 'connect' }
      );
    } catch (error) {
      this.updateMetrics({ 
        lastError: error as Error,
        reconnectAttempts: this.metrics.reconnectAttempts + 1
      });
      logger.error('Connection failed',
        { 
          error,
          metrics: this.metrics,
          timestamp: new Date().toISOString()
        },
        this.sessionId,
        { component: 'WebSocketService', action: 'connect', error: error as Error }
      );
      throw error;
    }
  }

  public send(message: any): boolean {
    logger.debug('Attempting to send message',
      { 
        messageType: message?.type,
        messageId: message?.id,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketService', action: 'send' }
    );
    
    const success = this.connectionManager.send(message);
    if (success) {
      this.updateMetrics({ messagesSent: this.metrics.messagesSent + 1 });
      logger.debug('Message sent successfully',
        {
          messageType: message?.type,
          messageId: message?.id,
          timestamp: new Date().toISOString()
        },
        this.sessionId,
        { component: 'WebSocketService', action: 'send' }
      );
    } else {
      logger.warn('Failed to send message',
        { 
          messageType: message?.type,
          messageId: message?.id,
          connectionState: this.connectionManager.getState(),
          timestamp: new Date().toISOString()
        },
        this.sessionId,
        { component: 'WebSocketService', action: 'send' }
      );
    }
    return success;
  }

  public disconnect() {
    logger.info('Disconnecting WebSocket service',
      {
        state: this.connectionManager.getState(),
        metrics: this.metrics,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketService', action: 'disconnect' }
    );
    this.connectionManager.disconnect();
  }

  public getState(): ConnectionState {
    return this.connectionManager.getState();
  }

  public getMetrics(): ConnectionMetrics {
    if (this.metrics.lastConnected) {
      this.metrics.uptime = Date.now() - this.metrics.lastConnected.getTime();
    }
    return { ...this.metrics };
  }
}