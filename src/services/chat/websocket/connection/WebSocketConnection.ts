import { WebSocketLogger } from '../monitoring/WebSocketLogger';
import { WebSocketStateManager } from '../monitoring/WebSocketStateManager';
import { WebSocketMessageHandler } from '../message/WebSocketMessageHandler';
import { ConnectionState, ConnectionMetrics } from '../types/connection';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';

export class WebSocketConnection {
  private ws: WebSocket | null = null;
  private logger: WebSocketLogger;
  private stateManager: WebSocketStateManager;
  private messageHandler: WebSocketMessageHandler;

  constructor(
    private sessionId: string,
    private onMessage?: (data: any) => void,
    private onStateChange?: (state: ConnectionState) => void,
    private onMetricsUpdate?: (metrics: Partial<ConnectionMetrics>) => void
  ) {
    this.logger = new WebSocketLogger(sessionId);
    this.stateManager = new WebSocketStateManager(sessionId, onStateChange);
    this.messageHandler = new WebSocketMessageHandler(
      sessionId,
      this.handleMessage.bind(this),
      this.handleMetricsUpdate.bind(this)
    );

    logger.info('WebSocket connection initialized', 
      { sessionId },
      sessionId,
      { component: 'WebSocketConnection', action: 'initialize' }
    );
  }

  async connect(accessToken: string) {
    try {
      if (!accessToken) {
        const error = new Error('No auth token provided');
        this.logger.logConnectionError(error, {
          sessionId: this.sessionId,
          error
        });
        toast.error('Authentication failed: No token provided');
        throw error;
      }

      const wsUrl = `${import.meta.env.VITE_SUPABASE_URL}/realtime-chat?access_token=${accessToken}`;
      
      this.logger.logConnectionAttempt({
        sessionId: this.sessionId,
        url: wsUrl
      });

      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
      
      toast.info('Connecting to chat service...');
      
    } catch (error) {
      this.logger.logConnectionError(error as Error, {
        sessionId: this.sessionId,
        retryAttempt: this.stateManager.getReconnectAttempts()
      });
      toast.error('Failed to connect to chat service');
      throw error;
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.stateManager.setState('connected');
      this.stateManager.resetReconnectAttempts();
      
      const metrics = {
        lastConnected: new Date(),
        reconnectAttempts: 0,
        lastError: null
      };
      
      this.logger.logConnectionSuccess(metrics);
      this.onMetricsUpdate?.(metrics);
      toast.success('Connected to chat service');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.logger.logMessageReceived({
          sessionId: this.sessionId,
          messageType: data?.type
        });
        this.messageHandler.handleMessage(data);
      } catch (error) {
        this.logger.logConnectionError(error as Error, {
          sessionId: this.sessionId,
          error: error as Error
        });
        toast.error('Failed to process message');
      }
    };

    this.ws.onerror = (event) => {
      const error = new Error('WebSocket error occurred');
      this.stateManager.setState('error');
      
      this.logger.logConnectionError(error, {
        sessionId: this.sessionId,
        error
      });
      
      this.onMetricsUpdate?.({
        lastError: error,
        lastConnected: null
      });
      
      toast.error('Connection error occurred');
    };

    this.ws.onclose = () => {
      this.stateManager.setState('disconnected');
      this.logger.logDisconnect();
      toast.error('Disconnected from chat service');
      this.handleReconnect();
    };
  }

  private async handleReconnect() {
    if (!this.stateManager.incrementReconnectAttempts()) {
      this.stateManager.setState('failed');
      toast.error('Maximum reconnection attempts reached');
      return;
    }

    this.stateManager.setState('reconnecting');
    toast.info('Attempting to reconnect...');
    
    const delay = Math.min(1000 * Math.pow(2, this.stateManager.getReconnectAttempts()), 30000);
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      // Attempt to get a fresh token here if needed
      const token = await this.refreshToken();
      await this.connect(token);
    } catch (error) {
      this.logger.logConnectionError(error as Error, {
        sessionId: this.sessionId,
        retryAttempt: this.stateManager.getReconnectAttempts()
      });
    }
  }

  private async refreshToken(): Promise<string> {
    // Implement token refresh logic here
    return '';
  }

  private handleMessage(data: any) {
    this.onMessage?.(data);
  }

  private handleMetricsUpdate(metrics: Partial<ConnectionMetrics>) {
    this.onMetricsUpdate?.(metrics);
  }

  send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        
        this.logger.logMessageSent({
          sessionId: this.sessionId,
          messageType: message?.type
        });
        
        return true;
      } catch (error) {
        this.logger.logConnectionError(error as Error, {
          sessionId: this.sessionId,
          error: error as Error
        });
        toast.error('Failed to send message');
        return false;
      }
    }
    
    toast.error('Connection not ready');
    return false;
  }

  disconnect() {
    if (this.ws) {
      this.logger.logDisconnect();
      this.ws.close();
      this.ws = null;
    }
  }

  getState(): number {
    return this.ws?.readyState ?? -1;
  }
}