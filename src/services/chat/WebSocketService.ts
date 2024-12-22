import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { toast } from 'sonner';
import { WEBSOCKET_URL, HEARTBEAT_INTERVAL, MAX_RECONNECT_ATTEMPTS, RECONNECT_INTERVALS } from '@/constants/websocket';
import { supabase } from '@/integrations/supabase/client';
import { logger } from './LoggingService';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private lastPingTime = 0;
  private sessionId: string;
  private onMessageCallback: ((message: any) => void) | null = null;
  private onStateChangeCallback: ((state: ConnectionState) => void) | null = null;
  private onMetricsUpdateCallback: ((metrics: Partial<ConnectionMetrics>) => void) | null = null;
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
    this.sessionId = sessionId;
    logger.info('WebSocket service initialized', { sessionId });
  }

  public setCallbacks(callbacks: {
    onMessage: (message: any) => void;
    onStateChange: (state: ConnectionState) => void;
    onMetricsUpdate: (metrics: Partial<ConnectionMetrics>) => void;
  }) {
    this.onMessageCallback = callbacks.onMessage;
    this.onStateChangeCallback = callbacks.onStateChange;
    this.onMetricsUpdateCallback = callbacks.onMetricsUpdate;
    logger.debug('WebSocket callbacks set');
  }

  private updateState(state: ConnectionState) {
    logger.info(`WebSocket state changed to: ${state}`);
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(state);
    }
  }

  private updateMetrics(updates: Partial<ConnectionMetrics>) {
    this.metrics = { ...this.metrics, ...updates };
    logger.debug('Metrics updated', this.metrics);
    if (this.onMetricsUpdateCallback) {
      this.onMetricsUpdateCallback(this.metrics);
    }
  }

  private setupHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.lastPingTime = Date.now();
        this.ws.send(JSON.stringify({ type: 'ping' }));
        logger.debug('Heartbeat sent');
      }
    }, HEARTBEAT_INTERVAL);
  }

  private async handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      logger.debug('Received message', data);

      if (data.type === 'pong') {
        const latency = Date.now() - this.lastPingTime;
        this.updateMetrics({ latency });
        return;
      }

      if (this.onMessageCallback) {
        this.onMessageCallback(data);
      }

      this.updateMetrics({ messagesReceived: this.metrics.messagesReceived + 1 });
    } catch (error) {
      logger.error('Error processing message', error);
      this.handleError(new Error('Failed to process message'));
    }
  }

  private handleError(error: Error) {
    logger.error('WebSocket error:', error);
    this.updateMetrics({ 
      lastError: error,
      reconnectAttempts: this.reconnectAttempts 
    });
    this.updateState('error');
    this.attemptReconnect();
  }

  private handleClose(event: CloseEvent) {
    logger.info('WebSocket connection closed', { 
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean 
    });
    this.updateState('disconnected');
    if (event.code !== 1000) {
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      logger.error('Max reconnection attempts reached');
      toast.error('Unable to establish connection. Please try again later.');
      this.updateState('failed');
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    const delay = RECONNECT_INTERVALS[this.reconnectAttempts] || RECONNECT_INTERVALS[RECONNECT_INTERVALS.length - 1];
    this.reconnectAttempts++;
    
    logger.info(`Attempting to reconnect`, { 
      attempt: this.reconnectAttempts,
      delay 
    });
    this.updateState('reconnecting');
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  public async connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      logger.info('WebSocket already connected');
      return;
    }

    try {
      this.updateState('connecting');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const wsUrl = `${WEBSOCKET_URL}?session_id=${this.sessionId}&access_token=${session.access_token}`;
      logger.info('Connecting to WebSocket', { url: wsUrl.replace(session.access_token, '[REDACTED]') });
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        logger.info('WebSocket connected successfully');
        this.updateState('connected');
        this.updateMetrics({ 
          lastConnected: new Date(),
          reconnectAttempts: 0,
          lastError: null
        });
        this.reconnectAttempts = 0;
        this.setupHeartbeat();
      };

      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onerror = () => this.handleError(new Error('WebSocket connection error'));
      this.ws.onclose = this.handleClose.bind(this);

    } catch (error) {
      logger.error('Connection setup failed', error);
      this.handleError(error instanceof Error ? error : new Error('Failed to setup connection'));
    }
  }

  public send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        logger.debug('Message sent', message);
        this.updateMetrics({ messagesSent: this.metrics.messagesSent + 1 });
        return true;
      } catch (error) {
        logger.error('Failed to send message', error);
        toast.error('Failed to send message');
        return false;
      }
    }
    return false;
  }

  public getState(): ConnectionState {
    if (!this.ws) return 'initial';
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'error';
    }
  }

  public getMetrics(): ConnectionMetrics {
    return { ...this.metrics };
  }

  public disconnect() {
    logger.info('Disconnecting WebSocket');
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.updateState('disconnected');
  }
}