import { WebSocketLogger } from './websocket/monitoring/WebSocketLogger';
import { ConnectionState, ConnectionMetrics, WebSocketCallbacks } from '@/types/websocket';
import { WEBSOCKET_URL } from '@/constants/websocket';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

export class WebSocketService {
  private ws: WebSocket | null = null;
  private logger: WebSocketLogger;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private callbacks: WebSocketCallbacks | null = null;

  constructor(private sessionId: string) {
    this.logger = new WebSocketLogger(sessionId);
    this.logger.log('debug', 'WebSocket Service initialized', {
      sessionId,
      timestamp: new Date().toISOString(),
      context: 'initialization'
    });
  }

  setCallbacks(callbacks: WebSocketCallbacks) {
    this.callbacks = callbacks;
    this.logger.log('debug', 'WebSocket callbacks configured', {
      sessionId: this.sessionId,
      hasMessageHandler: !!callbacks.onMessage,
      hasStateHandler: !!callbacks.onStateChange,
      hasMetricsHandler: !!callbacks.onMetricsUpdate,
      context: 'configuration'
    });
  }

  async connect(accessToken?: string) {
    try {
      this.logger.log('debug', 'Starting WebSocket connection process', {
        sessionId: this.sessionId,
        hasExistingToken: !!accessToken,
        context: 'connection_start'
      });

      let token = accessToken;
      if (!token) {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session?.access_token) {
          this.logger.log('error', 'No valid session found', {
            error,
            sessionId: this.sessionId,
            context: 'auth_validation'
          });
          toast.error('Authentication required');
          throw new Error('No valid session found');
        }
        token = session.access_token;
      }

      const wsUrl = `${WEBSOCKET_URL}?session_id=${this.sessionId}&access_token=${token}`;
      
      this.logger.log('debug', 'Attempting WebSocket connection', {
        sessionId: this.sessionId,
        url: WEBSOCKET_URL,
        hasToken: !!token,
        context: 'connection_attempt'
      });

      if (this.ws) {
        this.logger.log('debug', 'Closing existing connection', {
          sessionId: this.sessionId,
          readyState: this.ws.readyState,
          context: 'connection_cleanup'
        });
        this.ws.close();
        this.ws = null;
      }

      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
      
      this.callbacks?.onStateChange?.('connecting');
      toast.info('Connecting to chat service...');
      
    } catch (error) {
      this.logger.log('error', 'Connection failed', {
        error,
        sessionId: this.sessionId,
        retryAttempt: this.reconnectAttempts,
        context: 'connection_error'
      });
      toast.error('Failed to connect to chat service');
      this.handleReconnect();
      throw error;
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.logger.log('info', 'WebSocket connected', {
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      });
      this.reconnectAttempts = 0;
      this.callbacks?.onStateChange?.('connected');
      this.callbacks?.onMetricsUpdate?.({
        lastConnected: new Date(),
        reconnectAttempts: 0,
        lastError: null
      });
      toast.success('Connected to chat service');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.logger.log('info', 'Message received', {
          sessionId: this.sessionId,
          messageType: data?.type,
          timestamp: new Date().toISOString()
        });
        this.callbacks?.onMessage?.(data);
      } catch (error) {
        this.logger.log('error', 'Failed to process message', {
          error,
          sessionId: this.sessionId,
          raw: event.data
        });
        console.error('Failed to process message:', error);
      }
    };

    this.ws.onerror = () => {
      const error = new Error('WebSocket error occurred');
      this.logger.log('error', 'WebSocket error occurred', {
        sessionId: this.sessionId,
        error,
        timestamp: new Date().toISOString()
      });
      this.callbacks?.onStateChange?.('error');
      this.callbacks?.onMetricsUpdate?.({
        lastError: error,
        lastConnected: null
      });
      toast.error('Connection error occurred');
    };

    this.ws.onclose = () => {
      this.logger.log('info', 'WebSocket disconnected', {
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      });
      this.callbacks?.onStateChange?.('disconnected');
      toast.error('Disconnected from chat service');
      this.handleReconnect();
    };
  }

  private async handleReconnect() {
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      this.logger.log('error', 'Maximum reconnection attempts reached', {
        sessionId: this.sessionId,
        attempts: this.reconnectAttempts
      });
      this.callbacks?.onStateChange?.('failed');
      toast.error('Maximum reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    this.logger.log('info', 'Attempting to reconnect', {
      sessionId: this.sessionId,
      attempt: this.reconnectAttempts,
      timestamp: new Date().toISOString()
    });
    this.callbacks?.onStateChange?.('reconnecting');
    this.callbacks?.onMetricsUpdate?.({ reconnectAttempts: this.reconnectAttempts });
    toast.info('Attempting to reconnect...');
    
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      await this.connect();
    } catch (error) {
      this.logger.log('error', 'Reconnection attempt failed', {
        error,
        attempt: this.reconnectAttempts,
        sessionId: this.sessionId
      });
    }
  }

  send(message: any): boolean {
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
          sessionId: this.sessionId,
          message
        });
        toast.error('Failed to send message');
        return false;
      }
    }
    this.logger.log('error', 'Connection not ready', {
      sessionId: this.sessionId,
      readyState: this.ws?.readyState
    });
    toast.error('Connection not ready');
    return false;
  }

  disconnect() {
    if (this.ws) {
      this.logger.log('info', 'Disconnecting WebSocket', {
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      });
      this.ws.close();
      this.ws = null;
    }
  }
}