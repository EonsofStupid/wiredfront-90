import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { WebSocketLogger } from './WebSocketLogger';
import { WebSocketStateManager } from './WebSocketStateManager';
import { WebSocketEventHandler } from './WebSocketEventHandler';
import { WEBSOCKET_URL } from '@/constants/websocket';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

export class WebSocketConnectionService {
  private ws: WebSocket | null = null;
  private authToken: string | null = null;
  private logger: WebSocketLogger;
  private stateManager: WebSocketStateManager;
  private eventHandler: WebSocketEventHandler;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private readonly MAX_BACKOFF = 30000; // 30 seconds

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
  }

  private async refreshSession(): Promise<string | null> {
    this.logger.info('Attempting to refresh session', {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString()
    });
    toast.loading('Refreshing session...');

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        this.logger.error('Session refresh failed', {
          error,
          sessionId: this.sessionId
        });
        toast.error('Session refresh failed. Please log in again.');
        return null;
      }

      this.logger.info('Session refreshed successfully', {
        sessionId: this.sessionId,
        userId: session.user.id
      });
      toast.success('Session refreshed');
      return session.access_token;
    } catch (error) {
      this.logger.error('Session refresh error', {
        error,
        sessionId: this.sessionId
      });
      toast.error('Failed to refresh session');
      return null;
    }
  }

  private calculateBackoff(attempt: number): number {
    const backoff = Math.min(1000 * Math.pow(2, attempt), this.MAX_BACKOFF);
    const jitter = Math.random() * 0.2 * backoff; // 20% jitter
    return backoff + jitter;
  }

  private async handleReconnection() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    const attempt = this.stateManager.getReconnectAttempts();
    const backoff = this.calculateBackoff(attempt);

    this.logger.info('Planning reconnection attempt', {
      attempt,
      backoff,
      sessionId: this.sessionId
    });
    toast.loading(`Reconnecting in ${Math.round(backoff/1000)}s (Attempt ${attempt + 1})`);

    this.reconnectTimeout = setTimeout(async () => {
      if (!this.authToken) {
        this.logger.info('Attempting to refresh auth token before reconnect', {
          sessionId: this.sessionId
        });
        this.authToken = await this.refreshSession();
        
        if (!this.authToken) {
          this.stateManager.setState('error');
          return;
        }
      }

      try {
        await this.connect();
      } catch (error) {
        this.logger.error('Reconnection attempt failed', {
          error,
          attempt,
          sessionId: this.sessionId
        });
        
        if (this.stateManager.incrementReconnectAttempts()) {
          this.handleReconnection();
        } else {
          this.stateManager.setState('error');
          toast.error('Maximum reconnection attempts reached');
        }
      }
    }, backoff);
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
    this.stateManager.setState('connecting');

    try {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      this.ws = new WebSocket(wsUrl);
      this.eventHandler.setupEventHandlers(this.ws);
      
      this.ws.onerror = async (error) => {
        this.logger.error('WebSocket error occurred', {
          error,
          sessionId: this.sessionId
        });
        this.stateManager.setState('reconnecting');
        this.handleReconnection();
      };

      this.ws.onclose = () => {
        this.logger.info('WebSocket connection closed', {
          sessionId: this.sessionId
        });
        if (this.stateManager.getState() !== 'error') {
          this.stateManager.setState('reconnecting');
          this.handleReconnection();
        }
      };
      
    } catch (error) {
      this.logger.error('Connection failed', {
        error,
        sessionId: this.sessionId,
        attempt: this.stateManager.getReconnectAttempts()
      });
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