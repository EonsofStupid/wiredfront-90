import { ConnectionState, ConnectionMetrics, WebSocketCallbacks } from '@/types/websocket';
import { WebSocketLogger } from './websocket/monitoring/WebSocketLogger';
import { WebSocketStateManager } from './services/websocket/WebSocketStateManager';
import { WebSocketMessageHandler } from './websocket/message/WebSocketMessageHandler';
import { WEBSOCKET_URL } from '@/constants/websocket';
import { toast } from 'sonner';

// Split into smaller files for better maintainability
export class WebSocketService {
  private ws: WebSocket | null = null;
  private logger: WebSocketLogger;
  private stateManager: WebSocketStateManager;
  private messageHandler: WebSocketMessageHandler;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(private sessionId: string) {
    this.logger = WebSocketLogger.getInstance();
    this.stateManager = new WebSocketStateManager(sessionId);
    this.messageHandler = new WebSocketMessageHandler(
      sessionId,
      this.handleMessage.bind(this),
      this.handleMetricsUpdate.bind(this)
    );

    this.logger.log('info', 'WebSocket service initialized', {
      sessionId,
      timestamp: new Date().toISOString()
    });
  }

  private handleMessage(data: any) {
    this.logger.log('debug', 'Message received', {
      type: data.type,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString()
    });
  }

  private handleMetricsUpdate(metrics: Partial<ConnectionMetrics>) {
    this.logger.log('debug', 'Metrics updated', {
      metrics,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString()
    });
  }

  public async connect(accessToken: string) {
    try {
      if (!accessToken) {
        const error = new Error('No auth token provided');
        this.logger.log('error', 'Connection failed: No auth token', { error });
        toast.error('Authentication failed: No token provided');
        throw error;
      }

      const wsUrl = `${WEBSOCKET_URL}?session_id=${this.sessionId}&access_token=${accessToken}`;
      
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
        retryAttempt: this.stateManager.getReconnectAttempts()
      });
      toast.error('Failed to connect to chat service');
      throw error;
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      const connectedAt = new Date();
      this.stateManager.setState('connected');
      this.stateManager.resetReconnectAttempts();
      
      this.logger.log('info', 'WebSocket connected', {
        sessionId: this.sessionId,
        timestamp: connectedAt.toISOString()
      });
      
      this.startHeartbeat();
      toast.success('Connected to chat service');
    };

    this.ws.onmessage = (event) => {
      try {
        const startTime = Date.now();
        const data = JSON.parse(event.data);
        
        this.logger.log('debug', 'Message received', {
          sessionId: this.sessionId,
          messageType: data.type,
          timestamp: new Date().toISOString()
        });
        
        this.messageHandler.handleMessage(data);
        
        const latency = Date.now() - startTime;
        this.logger.log('debug', 'Message processed', {
          sessionId: this.sessionId,
          latency,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        this.logger.log('error', 'Failed to process message', {
          error,
          sessionId: this.sessionId
        });
        toast.error('Failed to process message');
      }
    };

    this.ws.onerror = (error) => {
      this.stateManager.setState('error');
      this.logger.log('error', 'WebSocket error occurred', {
        error,
        sessionId: this.sessionId
      });
      toast.error('Connection error occurred');
    };

    this.ws.onclose = () => {
      this.stateManager.setState('disconnected');
      this.logger.log('info', 'WebSocket disconnected', {
        sessionId: this.sessionId
      });
      this.stopHeartbeat();
      toast.error('Disconnected from chat service');
      this.handleReconnect();
    };
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
        this.logger.log('debug', 'Heartbeat sent', {
          sessionId: this.sessionId,
          timestamp: new Date().toISOString()
        });
      }
    }, 30000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private async handleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (!this.stateManager.incrementReconnectAttempts()) {
      this.stateManager.setState('failed');
      this.logger.log('error', 'Maximum reconnection attempts reached', {
        sessionId: this.sessionId
      });
      toast.error('Maximum reconnection attempts reached');
      return;
    }

    const attempt = this.stateManager.getReconnectAttempts();
    const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
    
    this.stateManager.setState('reconnecting');
    this.logger.log('info', 'Scheduling reconnection attempt', {
      sessionId: this.sessionId,
      attempt,
      delay
    });
    toast.info('Attempting to reconnect...');
    
    this.reconnectTimeout = setTimeout(async () => {
      try {
        const token = await this.refreshToken();
        await this.connect(token);
      } catch (error) {
        this.logger.log('error', 'Reconnection attempt failed', {
          error,
          sessionId: this.sessionId,
          attempt
        });
      }
    }, delay);
  }

  private async refreshToken(): Promise<string> {
    // Implement token refresh logic here
    return '';
  }

  public send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        
        this.logger.log('debug', 'Message sent', {
          sessionId: this.sessionId,
          messageType: message?.type,
          timestamp: new Date().toISOString()
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
    
    this.logger.log('warn', 'Cannot send message - connection not ready', {
      sessionId: this.sessionId,
      readyState: this.ws?.readyState
    });
    toast.error('Connection not ready');
    return false;
  }

  public disconnect() {
    this.logger.log('info', 'Disconnecting WebSocket', {
      sessionId: this.sessionId
    });
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public getState(): ConnectionState {
    return this.stateManager.getState();
  }
}