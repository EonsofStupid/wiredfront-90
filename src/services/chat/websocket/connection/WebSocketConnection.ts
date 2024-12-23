import { WebSocketLogger } from '../monitoring/WebSocketLogger';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { toast } from 'sonner';

export class WebSocketConnection {
  private ws: WebSocket | null = null;
  private logger: WebSocketLogger;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;

  constructor(
    private sessionId: string,
    private onMessage?: (data: any) => void,
    private onStateChange?: (state: ConnectionState) => void,
    private onMetricsUpdate?: (metrics: Partial<ConnectionMetrics>) => void
  ) {
    this.logger = WebSocketLogger.getInstance();
    this.logger.setSessionId(sessionId);
  }

  async connect(accessToken: string) {
    try {
      if (!accessToken) {
        const error = new Error('No auth token provided');
        this.logger.log('error', 'Connection failed: No auth token', { error });
        toast.error('Authentication failed: No token provided');
        throw error;
      }

      const wsUrl = `${import.meta.env.VITE_SUPABASE_URL}/realtime-chat?access_token=${accessToken}`;
      
      this.logger.log('info', 'Attempting WebSocket connection', {
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
      this.logger.log('error', 'Connection failed', {
        error,
        sessionId: this.sessionId,
        retryAttempt: this.reconnectAttempts
      });
      toast.error('Failed to connect to chat service');
      throw error;
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      const connectedAt = new Date();
      this.logger.updateConnectionState('connected');
      this.reconnectAttempts = 0;
      
      const metrics = {
        lastConnected: connectedAt,
        reconnectAttempts: 0,
        lastError: null
      };
      
      this.logger.updateMetrics(metrics);
      this.onMetricsUpdate?.(metrics);
      toast.success('Connected to chat service');
    };

    this.ws.onmessage = (event) => {
      try {
        const startTime = Date.now();
        const data = JSON.parse(event.data);
        
        this.logger.log('info', 'Message received', {
          sessionId: this.sessionId,
          messageType: data?.type
        });
        
        this.logger.updateMetrics({
          messagesReceived: this.logger.getMetrics().messagesReceived + 1,
          latency: Date.now() - startTime
        });
        
        this.onMessage?.(data);
      } catch (error) {
        this.logger.log('error', 'Failed to process message', {
          error,
          sessionId: this.sessionId
        });
        toast.error('Failed to process message');
      }
    };

    this.ws.onerror = () => {
      const error = new Error('WebSocket error occurred');
      this.logger.updateConnectionState('error');
      
      this.logger.log('error', 'WebSocket error occurred', {
        sessionId: this.sessionId,
        error
      });
      
      this.onMetricsUpdate?.({
        lastError: error,
        lastConnected: null
      });
      
      toast.error('Connection error occurred');
    };

    this.ws.onclose = (event) => {
      this.logger.updateConnectionState('disconnected');
      this.logger.log('info', 'WebSocket disconnected', {
        sessionId: this.sessionId
      });
      toast.error('Disconnected from chat service');
      this.handleReconnect();
    };
  }

  private async handleReconnect() {
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      this.logger.updateConnectionState('failed');
      toast.error('Maximum reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    this.logger.updateConnectionState('reconnecting');
    this.logger.updateMetrics({ reconnectAttempts: this.reconnectAttempts });
    
    toast.info('Attempting to reconnect...');
    
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      // Attempt to get a fresh token here if needed
      const token = await this.refreshToken();
      await this.connect(token);
    } catch (error) {
      this.logger.log('error', 'Reconnection attempt failed', {
        error,
        sessionId: this.sessionId,
        retryAttempt: this.reconnectAttempts
      });
    }
  }

  private async refreshToken(): Promise<string> {
    // Implement token refresh logic here
    return '';
  }

  send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        
        this.logger.log('info', 'Message sent', {
          sessionId: this.sessionId,
          messageType: message?.type
        });
        
        this.logger.updateMetrics({
          messagesSent: this.logger.getMetrics().messagesSent + 1
        });
        
        return true;
      } catch (error) {
        this.logger.log('error', 'Failed to send message', {
          error,
          sessionId: this.sessionId
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
      this.logger.log('info', 'Disconnecting WebSocket', {
        sessionId: this.sessionId
      });
      this.ws.close();
      this.ws = null;
    }
  }

  getState(): number {
    return this.ws?.readyState ?? -1;
  }
}
