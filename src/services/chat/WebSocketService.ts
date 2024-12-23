import { WebSocketLogger } from './websocket/monitoring/WebSocketLogger';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { WEBSOCKET_URL } from '@/constants/websocket';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

export class WebSocketService {
  private ws: WebSocket | null = null;
  private logger: WebSocketLogger;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;

  constructor(
    private sessionId: string,
    private onMessage?: (data: any) => void,
    private onStateChange?: (state: ConnectionState) => void
  ) {
    this.logger = WebSocketLogger.getInstance();
    console.log('WebSocket Service initialized:', { sessionId });
  }

  async connect() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session?.access_token) {
        console.error('No valid session found');
        toast.error('Authentication required');
        throw new Error('No valid session found');
      }

      const wsUrl = `${WEBSOCKET_URL}?session_id=${this.sessionId}&access_token=${session.access_token}`;
      
      console.log('Attempting WebSocket connection:', {
        sessionId: this.sessionId,
        hasToken: !!session.access_token
      });

      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
      
      toast.info('Connecting to chat service...');
      
    } catch (error) {
      console.error('Connection failed:', {
        error,
        sessionId: this.sessionId,
        retryAttempt: this.reconnectAttempts
      });
      toast.error('Failed to connect to chat service');
      this.handleReconnect();
      throw error;
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.onStateChange?.('connected');
      toast.success('Connected to chat service');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Message received:', data);
        this.onMessage?.(data);
      } catch (error) {
        console.error('Failed to process message:', error);
      }
    };

    this.ws.onerror = () => {
      console.error('WebSocket error occurred');
      this.onStateChange?.('error');
      toast.error('Connection error occurred');
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.onStateChange?.('disconnected');
      toast.error('Disconnected from chat service');
      this.handleReconnect();
    };
  }

  private async handleReconnect() {
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      this.onStateChange?.('failed');
      toast.error('Maximum reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    this.onStateChange?.('reconnecting');
    toast.info('Attempting to reconnect...');
    
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      await this.connect();
    } catch (error) {
      console.error('Reconnection attempt failed:', {
        error,
        attempt: this.reconnectAttempts
      });
    }
  }

  send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        console.log('Message sent:', message);
        return true;
      } catch (error) {
        console.error('Failed to send message:', error);
        toast.error('Failed to send message');
        return false;
      }
    }
    console.error('Connection not ready');
    toast.error('Connection not ready');
    return false;
  }

  disconnect() {
    if (this.ws) {
      console.log('Disconnecting WebSocket');
      this.ws.close();
      this.ws = null;
    }
  }
}