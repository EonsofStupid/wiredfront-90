import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { WebSocketLogger } from '../monitoring/WebSocketLogger';
import { WebSocketAuthenticator } from './WebSocketAuthenticator';
import { WebSocketReconnection } from './WebSocketReconnection';
import { WEBSOCKET_URL } from '@/constants/websocket';
import { toast } from 'sonner';

export class WebSocketConnection {
  private ws: WebSocket | null = null;
  private logger: WebSocketLogger;
  private authenticator: WebSocketAuthenticator;
  private reconnection: WebSocketReconnection;

  constructor(
    private sessionId: string,
    private metricsService: any,
    onStateChange: (state: ConnectionState) => void,
    onMessage: (data: any) => void,
    onMetricsUpdate: (metrics: Partial<ConnectionMetrics>) => void
  ) {
    this.logger = new WebSocketLogger(sessionId);
    this.authenticator = new WebSocketAuthenticator(this.logger, sessionId);
    this.reconnection = new WebSocketReconnection(
      this.logger,
      sessionId,
      onStateChange,
      this.connect.bind(this)
    );
  }

  async connect(): Promise<void> {
    try {
      const token = await this.authenticator.validateSession();
      if (!token) {
        throw new Error('No auth token available');
      }

      const wsUrl = `${WEBSOCKET_URL}?session_id=${this.sessionId}&access_token=${token}`;
      
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
      
    } catch (error) {
      this.logger.error('Connection failed', {
        error,
        sessionId: this.sessionId,
        attempt: this.reconnection.getAttempts()
      });
      throw error;
    }
  }

  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.logger.info('Connection established', {
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      });
      toast.success('Connected to chat service');
    };

    this.ws.onclose = () => {
      this.logger.info('Connection closed', {
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      });
      this.reconnection.handleReconnection();
    };

    this.ws.onerror = (error) => {
      this.logger.error('WebSocket error', {
        error,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      });
      toast.error('Connection error occurred');
    };
  }

  send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        this.metricsService.incrementMessagesSent();
        return true;
      } catch (error) {
        this.logger.error('Failed to send message', {
          error,
          sessionId: this.sessionId
        });
        toast.error('Failed to send message');
        return false;
      }
    }
    toast.error('Cannot send message - not connected');
    return false;
  }

  disconnect(): void {
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