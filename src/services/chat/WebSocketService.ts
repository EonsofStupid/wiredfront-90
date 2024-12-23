import { ConnectionState, ConnectionMetrics, WebSocketCallbacks } from '@/types/websocket';
import { WebSocketLogger } from './websocket/monitoring/WebSocketLogger';
import { WEBSOCKET_URL } from '@/constants/websocket';
import { toast } from 'sonner';

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
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private callbacks: WebSocketCallbacks;

  constructor(private sessionId: string) {
    this.logger = WebSocketLogger.getInstance();
    
    this.logger.log('info', 'WebSocket service initialized', {
      sessionId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Sets up callback functions for WebSocket events
   */
  public async setCallbacks(callbacks: WebSocketCallbacks): Promise<void> {
    this.callbacks = callbacks;
    this.logger.log('info', 'WebSocket callbacks configured', {
      sessionId: this.sessionId,
      hasMessageCallback: !!callbacks.onMessage,
      hasStateCallback: !!callbacks.onStateChange,
      hasMetricsCallback: !!callbacks.onMetricsUpdate
    });
  }

  private handleMessage(data: any) {
    this.logger.log('info', 'Message received', {
      type: data?.type,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString()
    });
    this.callbacks?.onMessage(data);
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      const connectedAt = new Date();
      this.logger.updateConnectionState('connected');
      this.logger.updateMetrics({
        lastConnected: connectedAt,
        reconnectAttempts: 0,
        lastError: null
      });
      this.callbacks?.onStateChange('connected');
      toast.success('Connected to chat service');
    };

    this.ws.onmessage = (event) => {
      try {
        const startTime = Date.now();
        const data = JSON.parse(event.data);
        
        this.logger.log('info', 'Message received', {
          sessionId: this.sessionId,
          messageType: data?.type,
          timestamp: new Date().toISOString()
        });
        
        this.logger.updateMetrics({
          messagesReceived: this.logger.getMetrics().messagesReceived + 1,
          latency: Date.now() - startTime
        });
        
        this.callbacks?.onMessage(data);
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
      this.callbacks?.onStateChange('error');
      toast.error('Connection error occurred');
    };

    this.ws.onclose = (event) => {
      this.logger.updateConnectionState('disconnected');
      this.logger.log('info', 'WebSocket disconnected', {
        sessionId: this.sessionId
      });
      this.callbacks?.onStateChange('disconnected');
      toast.error('Disconnected from chat service');
      this.handleReconnect();
    };
  }

  private async handleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.logger.updateConnectionState('reconnecting');
    this.logger.log('info', 'Attempting to reconnect', {
      sessionId: this.sessionId
    });
    toast.info('Attempting to reconnect...');

    const delay = Math.min(1000 * Math.pow(2, this.logger.getMetrics().reconnectAttempts), 30000);
    this.reconnectTimeout = setTimeout(async () => {
      try {
        const token = await this.refreshToken();
        await this.connect(token);
      } catch (error) {
        this.logger.log('error', 'Reconnection attempt failed', {
          error,
          sessionId: this.sessionId
        });
      }
    }, delay);
  }

  private async refreshToken(): Promise<string> {
    // Implement token refresh logic here
    return '';
  }

  /**
   * Establishes WebSocket connection with authentication
   */
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
        sessionId: this.sessionId
      });
      toast.error('Failed to connect to chat service');
      throw error;
    }
  }

  /**
   * Sends a message through the WebSocket connection
   */
  public send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        
        this.logger.log('info', 'Message sent', {
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
    
    toast.error('Connection not ready');
    return false;
  }

  /**
   * Cleanly disconnects the WebSocket connection
   */
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

  /**
   * Returns the current connection state
   */
  public getState(): ConnectionState {
    return this.logger.getConnectionState();
  }
}
