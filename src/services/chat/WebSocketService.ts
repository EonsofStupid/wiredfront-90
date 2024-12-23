import { WebSocketLogger } from './websocket/monitoring/WebSocketLogger';
import { WEBSOCKET_URL } from '@/constants/websocket';
import { supabase } from "@/integrations/supabase/client";
import { ConnectionState } from '@/types/websocket';

interface WebSocketCallbacks {
  onMessage: (data: any) => void;
  onStateChange?: (state: ConnectionState) => void;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private logger: WebSocketLogger;
  private sessionId: string;
  private onMessage?: (data: any) => void;
  private onStateChange?: (state: ConnectionState) => void;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.logger = WebSocketLogger.getInstance();
    console.log('WebSocket service initialized', { sessionId });
  }

  setCallbacks(callbacks: WebSocketCallbacks) {
    this.onMessage = callbacks.onMessage;
    this.onStateChange = callbacks.onStateChange;
  }

  async connect() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }

      const wsUrl = `${WEBSOCKET_URL}?session_id=${this.sessionId}&access_token=${session.access_token}`;
      
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      console.log('Connecting to WebSocket...', { sessionId: this.sessionId });
      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
      
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      throw error;
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected', { sessionId: this.sessionId });
      this.onStateChange?.('connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        this.onMessage?.(data);
      } catch (error) {
        console.error('Failed to process message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.onStateChange?.('error');
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected', { sessionId: this.sessionId });
      this.onStateChange?.('disconnected');
    };
  }

  send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        console.log('Message sent:', message);
        return true;
      } catch (error) {
        console.error('Failed to send message:', error);
        return false;
      }
    }
    console.warn('WebSocket not ready to send message');
    return false;
  }

  disconnect() {
    if (this.ws) {
      console.log('Disconnecting WebSocket', { sessionId: this.sessionId });
      this.ws.close();
      this.ws = null;
    }
  }
}