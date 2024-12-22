import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { WebSocketLogger } from './WebSocketLogger';
import { WebSocketStateManager } from './WebSocketStateManager';
import { WebSocketMetricsService } from './WebSocketMetricsService';
import { supabase } from "@/integrations/supabase/client";
import { WEBSOCKET_URL } from '@/constants/websocket';

export class WebSocketConnectionService {
  private ws: WebSocket | null = null;
  private logger: WebSocketLogger;
  private stateManager: WebSocketStateManager;
  private metricsService: WebSocketMetricsService;
  private sessionId: string;
  private authToken: string | null = null;

  constructor(
    sessionId: string,
    private onMessage?: (data: any) => void,
    private onStateChange?: (state: ConnectionState) => void,
    private onMetricsUpdate?: (metrics: Partial<ConnectionMetrics>) => void
  ) {
    this.sessionId = sessionId;
    this.logger = new WebSocketLogger(sessionId);
    this.stateManager = new WebSocketStateManager(sessionId);
    this.metricsService = new WebSocketMetricsService(sessionId);
  }

  async validateSession(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      const isValid = !!session?.access_token;
      this.logger.logSessionValidation(isValid, {
        sessionId: this.sessionId,
        userId: session?.user?.id
      });
      
      if (isValid) {
        this.authToken = session.access_token;
      }
      
      return isValid;
    } catch (error) {
      this.logger.logConnectionError(error as Error, {
        sessionId: this.sessionId,
        error: error as Error
      });
      return false;
    }
  }

  async connect() {
    try {
      const isSessionValid = await this.validateSession();
      if (!isSessionValid) {
        throw new Error('Invalid session');
      }

      const wsUrl = `${WEBSOCKET_URL}?session_id=${this.sessionId}&access_token=${this.authToken}`;
      
      this.logger.logConnectionAttempt({
        sessionId: this.sessionId
      });

      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
      
    } catch (error) {
      this.logger.logConnectionError(error as Error, {
        sessionId: this.sessionId,
        retryAttempt: this.stateManager.getReconnectAttempts()
      });
      await this.handleReconnect();
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
    const connectedAt = new Date();
    this.stateManager.setState('connected');
    this.stateManager.resetReconnectAttempts();
    
    this.metricsService.updateMetrics({
      lastConnected: connectedAt,
      reconnectAttempts: 0,
      lastError: null
    });

    this.logger.logConnectionSuccess({
      sessionId: this.sessionId,
      connectionState: 'connected'
    });
  }

  private handleMessage(event: MessageEvent) {
    try {
      const startTime = Date.now();
      const data = JSON.parse(event.data);
      
      this.logger.logMessageReceived({
        sessionId: this.sessionId,
        messageId: crypto.randomUUID()
      });
      
      this.metricsService.incrementMessagesReceived();
      this.metricsService.recordLatency(startTime);
      
      this.onMessage?.(data);
    } catch (error) {
      this.logger.logConnectionError(error as Error, {
        sessionId: this.sessionId,
        error: error as Error
      });
    }
  }

  private handleError(event: Event) {
    const error = new Error('WebSocket error occurred');
    this.stateManager.setState('error');
    this.metricsService.recordError(error);
    
    this.logger.logConnectionError(error, {
      sessionId: this.sessionId,
      connectionState: 'error'
    });
  }

  private handleClose(event: CloseEvent) {
    this.stateManager.setState('disconnected');
    
    this.logger.logDisconnect(event.code, event.reason);
    
    this.handleReconnect();
  }

  private async handleReconnect() {
    if (!this.stateManager.incrementReconnectAttempts()) {
      this.stateManager.setState('failed');
      return;
    }

    this.stateManager.setState('reconnecting');
    
    const delay = Math.min(1000 * Math.pow(2, this.stateManager.getReconnectAttempts()), 30000);
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      await this.connect();
    } catch (error) {
      this.logger.logConnectionError(error as Error, {
        sessionId: this.sessionId,
        retryAttempt: this.stateManager.getReconnectAttempts()
      });
    }
  }

  send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        const messageId = crypto.randomUUID();
        this.ws.send(JSON.stringify(message));
        
        this.metricsService.incrementMessagesSent();
        this.logger.logMessageSent({
          sessionId: this.sessionId,
          messageId
        });
        
        return true;
      } catch (error) {
        this.logger.logConnectionError(error as Error, {
          sessionId: this.sessionId,
          error: error as Error
        });
        return false;
      }
    }
    return false;
  }

  getState(): ConnectionState {
    return this.stateManager.getState();
  }

  getMetrics(): ConnectionMetrics {
    return this.metricsService.getMetrics();
  }

  disconnect() {
    if (this.ws) {
      this.logger.logDisconnect();
      this.ws.close();
      this.ws = null;
    }
  }
}