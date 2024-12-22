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

  constructor(sessionId: string) {
    this.connectionManager = new ConnectionManager(sessionId);
    logger.info('WebSocket service initialized', { sessionId });
  }

  public async setCallbacks(callbacks: WebSocketCallbacks) {
    const connectionCallbacks: ConnectionCallbacks = {
      onMessage: (message) => {
        this.updateMetrics({ messagesReceived: this.metrics.messagesReceived + 1 });
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
        callbacks.onStateChange(state as ConnectionState);
      },
      onMetricsUpdate: callbacks.onMetricsUpdate
    };

    this.connectionManager.setCallbacks(connectionCallbacks);
  }

  private updateMetrics(updates: Partial<ConnectionMetrics>) {
    this.metrics = { ...this.metrics, ...updates };
    logger.debug('Metrics updated', this.metrics);
  }

  public async connect(accessToken: string) {
    if (!accessToken) {
      throw new Error('Access token is required');
    }

    try {
      this.connectionManager.setAuthToken(accessToken);
      await this.connectionManager.connect();
    } catch (error) {
      this.updateMetrics({ 
        lastError: error as Error,
        reconnectAttempts: this.metrics.reconnectAttempts + 1
      });
      throw error;
    }
  }

  public send(message: any): boolean {
    const success = this.connectionManager.send(message);
    if (success) {
      this.updateMetrics({ messagesSent: this.metrics.messagesSent + 1 });
    }
    return success;
  }

  public disconnect() {
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