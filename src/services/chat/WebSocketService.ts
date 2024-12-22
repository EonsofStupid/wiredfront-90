import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { ConnectionManager } from './ConnectionManager';
import { logger } from './LoggingService';
import { supabase } from "@/integrations/supabase/client";

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
    logger.info('WebSocket service initialized', { sessionId }, sessionId);
  }

  public async setCallbacks(callbacks: {
    onMessage: (message: any) => void;
    onStateChange: (state: ConnectionState) => void;
    onMetricsUpdate: (metrics: Partial<ConnectionMetrics>) => void;
  }) {
    // Get current session token
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      logger.error('No active session found', {}, this.connectionManager.getSessionId());
      throw new Error('Authentication required');
    }

    // Set auth token in connection manager
    this.connectionManager.setAuthToken(session.access_token);

    this.connectionManager.setCallbacks({
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
      }
    });
  }

  private updateMetrics(updates: Partial<ConnectionMetrics>) {
    this.metrics = { ...this.metrics, ...updates };
    logger.debug('Metrics updated', this.metrics, this.connectionManager.getSessionId());
  }

  public async connect() {
    try {
      // Verify we have a current session before connecting
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No active session');
      }
      
      // Update token in case it changed
      this.connectionManager.setAuthToken(session.access_token);
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