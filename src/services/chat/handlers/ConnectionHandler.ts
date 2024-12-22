import { logger } from '../LoggingService';
import { supabase } from "@/integrations/supabase/client";
import { WebSocketCallbacks } from '../types/websocket';
import { ConnectionState } from '@/types/websocket';

export class ConnectionHandler {
  private ws: WebSocket | null = null;
  private sessionId: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number;
  private callbacks: WebSocketCallbacks;
  private authToken: string | null = null;

  constructor(sessionId: string, callbacks: WebSocketCallbacks, maxReconnectAttempts: number = 5) {
    this.sessionId = sessionId;
    this.callbacks = callbacks;
    this.maxReconnectAttempts = maxReconnectAttempts;
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  async connect() {
    try {
      if (!this.authToken) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          throw new Error('No valid session found');
        }
        this.authToken = session.access_token;
      }

      const wsUrl = `wss://${process.env.VITE_SUPABASE_PROJECT_ID}.functions.supabase.co/realtime-chat?session_id=${this.sessionId}&access_token=${this.authToken}`;
      
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();

    } catch (error) {
      logger.error('Failed to establish WebSocket connection',
        { 
          error,
          reconnectAttempts: this.reconnectAttempts,
          timestamp: new Date().toISOString()
        },
        this.sessionId,
        { component: 'ConnectionHandler', action: 'connect', error: error as Error }
      );
      this.handleReconnect();
      throw error;
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = this.handleOpen.bind(this);
    this.ws.onclose = this.handleClose.bind(this);
    this.ws.onerror = this.handleError.bind(this);
  }

  private handleOpen() {
    this.reconnectAttempts = 0;
    this.callbacks.onStateChange('connected');
    this.callbacks.onMetricsUpdate({ 
      lastConnected: new Date(),
      reconnectAttempts: this.reconnectAttempts
    });
  }

  private handleClose(event: CloseEvent) {
    this.callbacks.onStateChange('disconnected');
    this.handleReconnect();
  }

  private handleError() {
    this.callbacks.onStateChange('error');
    this.callbacks.onMetricsUpdate({ 
      lastError: new Error('WebSocket connection error'),
      reconnectAttempts: this.reconnectAttempts
    });
    this.handleReconnect();
  }

  private async handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.callbacks.onStateChange('failed');
      return;
    }

    this.reconnectAttempts++;
    this.callbacks.onStateChange('reconnecting');

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      await this.connect();
    } catch (error) {
      logger.error('Reconnection attempt failed',
        { 
          error,
          attempt: this.reconnectAttempts,
          timestamp: new Date().toISOString()
        },
        this.sessionId,
        { component: 'ConnectionHandler', action: 'handleReconnect', error: error as Error }
      );
    }
  }

  getState(): number {
    return this.ws?.readyState ?? -1;
  }

  send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        return true;
      } catch (error) {
        logger.error('Failed to send WebSocket message',
          { 
            error,
            message,
            timestamp: new Date().toISOString()
          },
          this.sessionId,
          { component: 'ConnectionHandler', action: 'send', error: error as Error }
        );
        return false;
      }
    }
    return false;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}