import { WebSocketLogger } from '../monitoring/WebSocketLogger';
import { ConnectionState } from '@/types/websocket';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

export class ConnectionManager {
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
  }

  async connect() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session?.access_token) {
        this.logger.log('error', 'No valid session found');
        toast.error('Authentication required');
        throw new Error('No valid session found');
      }

      const wsUrl = `wss://ewjisqyvspdvhyppkhnm.functions.supabase.co/realtime-chat?session_id=${this.sessionId}&access_token=${session.access_token}`;
      
      this.logger.log('info', 'Attempting WebSocket connection', {
        sessionId: this.sessionId,
        hasToken: !!session.access_token
      });

      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
      
    } catch (error) {
      this.logger.log('error', 'Connection failed', {
        error,
        sessionId: this.sessionId,
        retryAttempt: this.reconnectAttempts
      });
      await this.handleReconnect();
      throw error;
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.logger.log('info', 'WebSocket connected');
      this.reconnectAttempts = 0;
      this.onStateChange?.('connected');
      toast.success('Connected to chat service');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.onMessage?.(data);
      } catch (error) {
        this.logger.log('error', 'Failed to process message', { error });
      }
    };

    this.ws.onerror = () => {
      this.logger.log('error', 'WebSocket error occurred');
      this.onStateChange?.('error');
      toast.error('Connection error occurred');
    };

    this.ws.onclose = () => {
      this.logger.log('info', 'WebSocket disconnected');
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
      this.logger.log('error', 'Reconnection attempt failed', {
        error,
        attempt: this.reconnectAttempts
      });
    }
  }

  send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        return true;
      } catch (error) {
        this.logger.log('error', 'Failed to send message', { error });
        toast.error('Failed to send message');
        return false;
      }
    }
    toast.error('Connection not ready');
    return false;
  }

  disconnect() {
    if (this.ws) {
      this.logger.log('info', 'Disconnecting WebSocket');
      this.ws.close();
      this.ws = null;
    }
  }
}