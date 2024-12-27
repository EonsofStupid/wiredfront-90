import { supabase } from "@/integrations/supabase/client";
import { logger } from './LoggingService';
import { ConnectionState } from '@/types/websocket';
import { WEBSOCKET_URL } from '@/constants/websocket';

class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 3;
  private onMessageCallback: ((data: any) => void) | null = null;
  private onStateChangeCallback: ((state: ConnectionState) => void) | null = null;
  private onMetricsUpdateCallback: ((metrics: any) => void) | null = null;

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  async connect() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        logger.info('No authenticated session found, operating in limited mode');
        this.onStateChangeCallback?.('disconnected');
        return;
      }

      const wsUrl = `${WEBSOCKET_URL}?access_token=${session.access_token}`;
      
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
      
    } catch (error) {
      logger.error('Connection failed:', error);
      this.handleReconnect();
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      logger.info('WebSocket connected');
      this.reconnectAttempts = 0;
      this.onStateChangeCallback?.('connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.onMessageCallback?.(data);
      } catch (error) {
        logger.error('Failed to process message:', error);
      }
    };

    this.ws.onerror = (error) => {
      logger.error('WebSocket error occurred:', error);
      this.onStateChangeCallback?.('error');
    };

    this.ws.onclose = () => {
      logger.info('WebSocket disconnected');
      this.onStateChangeCallback?.('disconnected');
      this.handleReconnect();
    };
  }

  private async handleReconnect() {
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      logger.error('Maximum reconnection attempts reached');
      this.onStateChangeCallback?.('error');
      return;
    }

    this.reconnectAttempts++;
    this.onStateChangeCallback?.('reconnecting');
    logger.info('Attempting to reconnect...');

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    await new Promise(resolve => setTimeout(resolve, delay));

    this.connect();
  }

  setCallbacks(
    onMessage: (data: any) => void,
    onStateChange: (state: ConnectionState) => void,
    onMetricsUpdate: (metrics: any) => void
  ) {
    this.onMessageCallback = onMessage;
    this.onStateChangeCallback = onStateChange;
    this.onMetricsUpdateCallback = onMetricsUpdate;
  }

  send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        return true;
      } catch (error) {
        logger.error('Failed to send message:', error);
        return false;
      }
    }
    return false;
  }

  disconnect() {
    if (this.ws) {
      logger.info('Disconnecting WebSocket');
      this.ws.close();
      this.ws = null;
    }
  }
}

export const webSocketService = WebSocketService.getInstance();