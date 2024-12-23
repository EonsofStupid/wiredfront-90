import { ConnectionState, ConnectionMetrics, WebSocketCallbacks } from '@/types/websocket';
import { WebSocketLogger } from './websocket/monitoring/WebSocketLogger';
import { WebSocketStateManager } from './services/websocket/WebSocketStateManager';
import { WebSocketMessageHandler } from './websocket/message/WebSocketMessageHandler';
import { WEBSOCKET_URL } from '@/constants/websocket';
import { toast } from 'sonner';
import { logger } from './LoggingService';

/**
 * WebSocketService handles the core WebSocket functionality including:
 * - Connection management
 * - Message handling
 * - State management
 * - Reconnection logic
 */
export class WebSocketService {
  private ws: WebSocket | null = null;
  private logger: WebSocketLogger;
  private stateManager: WebSocketStateManager;
  private messageHandler: WebSocketMessageHandler;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private callbacks: WebSocketCallbacks;

  constructor(private sessionId: string) {
    this.logger = new WebSocketLogger(sessionId);
    this.stateManager = new WebSocketStateManager(sessionId);
    this.messageHandler = new WebSocketMessageHandler(
      sessionId,
      this.handleMessage.bind(this),
      this.handleMetricsUpdate.bind(this)
    );

    logger.info('WebSocket service initialized', {
      sessionId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Sets up callback functions for WebSocket events
   */
  public async setCallbacks(callbacks: WebSocketCallbacks): Promise<void> {
    this.callbacks = callbacks;
    logger.info('WebSocket callbacks configured', {
      sessionId: this.sessionId,
      hasMessageCallback: !!callbacks.onMessage,
      hasStateCallback: !!callbacks.onStateChange,
      hasMetricsCallback: !!callbacks.onMetricsUpdate
    });
  }

  private handleMessage(data: any) {
    logger.info('Message received', {
      type: data?.type,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString()
    });
    this.callbacks?.onMessage(data);
  }

  private handleMetricsUpdate(metrics: Partial<ConnectionMetrics>) {
    logger.info('Metrics updated', {
      metrics,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString()
    });
    this.callbacks?.onMetricsUpdate(metrics);
  }

  /**
   * Establishes WebSocket connection with authentication
   */
  public async connect(accessToken: string) {
    try {
      if (!accessToken) {
        const error = new Error('No auth token provided');
        logger.error('Connection failed: No auth token', { 
          error,
          sessionId: this.sessionId 
        });
        toast.error('Authentication failed: No token provided');
        throw error;
      }

      const wsUrl = `${WEBSOCKET_URL}?session_id=${this.sessionId}&access_token=${accessToken}`;
      
      logger.info('Attempting WebSocket connection', {
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
      logger.error('Connection failed', {
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

  /**
   * Handles reconnection attempts with exponential backoff
   */
  private async handleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (!this.stateManager.incrementReconnectAttempts()) {
      this.stateManager.setState('failed');
      logger.error('Maximum reconnection attempts reached', {
        sessionId: this.sessionId
      });
      toast.error('Maximum reconnection attempts reached');
      return;
    }

    const attempt = this.stateManager.getReconnectAttempts();
    const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
    
    this.stateManager.setState('reconnecting');
    logger.info('Scheduling reconnection attempt', {
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
        logger.error('Reconnection attempt failed', {
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

  /**
   * Sends a message through the WebSocket connection
   */
  public send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        
        logger.info('Message sent', {
          sessionId: this.sessionId,
          messageType: message?.type,
          timestamp: new Date().toISOString()
        });
        
        return true;
      } catch (error) {
        logger.error('Failed to send message', {
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

  /**
   * Cleanly disconnects the WebSocket connection
   */
  public disconnect() {
    logger.info('Disconnecting WebSocket', {
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

  /**
   * Returns the current connection state
   */
  public getState(): ConnectionState {
    return this.stateManager.getState();
  }
}
