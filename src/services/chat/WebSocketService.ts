import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { toast } from 'sonner';
import { WEBSOCKET_URL, HEARTBEAT_INTERVAL, MAX_RECONNECT_ATTEMPTS, RECONNECT_INTERVALS } from '@/constants/websocket';
import { supabase } from '@/integrations/supabase/client';

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
    this.setupHeartbeat = this.setupHeartbeat.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.connect = this.connect.bind(this);
  }

  public setCallbacks(callbacks: {
    onMessage: (message: any) => void;
    onStateChange: (state: ConnectionState) => void;
    onMetricsUpdate: (metrics: Partial<ConnectionMetrics>) => void;
  }) {
    this.onMessageCallback = callbacks.onMessage;
    this.onStateChangeCallback = callbacks.onStateChange;
    this.onMetricsUpdateCallback = callbacks.onMetricsUpdate;
  }

  private updateState(state: ConnectionState) {
    console.log(`[WebSocket] State changed to: ${state}`);
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(state);
    }
  }

  private updateMetrics(updates: Partial<ConnectionMetrics>) {
    this.metrics = { ...this.metrics, ...updates };
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
        console.log('[WebSocket] Heartbeat sent');
      }
    }, HEARTBEAT_INTERVAL);
  }

  private async handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      console.log('[WebSocket] Received message:', data);

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
      console.error('[WebSocket] Error processing message:', error);
      this.handleError(new Error('Failed to process message'));
    }
  }

  private handleError(error: Error) {
    console.error('[WebSocket] Connection error:', error);
    this.updateMetrics({ 
      lastError: error,
      reconnectAttempts: this.reconnectAttempts 
    });
    this.updateState('error');
    this.attemptReconnect();
  }

  private handleClose(event: CloseEvent) {
    console.log('[WebSocket] Connection closed:', event);
    this.updateState('disconnected');
    if (event.code !== 1000) {
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('[WebSocket] Max reconnection attempts reached');
      toast.error('Unable to establish connection. Please try again later.');
      this.updateState('failed');
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    const delay = RECONNECT_INTERVALS[this.reconnectAttempts] || RECONNECT_INTERVALS[RECONNECT_INTERVALS.length - 1];
    this.reconnectAttempts++;
    
    console.log(`[WebSocket] Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    this.updateState('reconnecting');
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  public async connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('[WebSocket] Already connected');
      return;
    }

    try {
      this.updateState('connecting');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const wsUrl = `${WEBSOCKET_URL}?session_id=${this.sessionId}&access_token=${session.access_token}`;
      console.log('[WebSocket] Connecting to:', wsUrl);
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('[WebSocket] Connected successfully');
        this.updateState('connected');
        this.updateMetrics({ 
          lastConnected: new Date(),
          reconnectAttempts: 0,
          lastError: null
        });
        this.reconnectAttempts = 0;
        this.setupHeartbeat();
      };

      this.ws.onmessage = this.handleMessage;
      this.ws.onerror = () => this.handleError(new Error('WebSocket connection error'));
      this.ws.onclose = this.handleClose;

    } catch (error) {
      console.error('[WebSocket] Connection setup failed:', error);
      this.handleError(error instanceof Error ? error : new Error('Failed to setup connection'));
    }
  }

  public send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        console.log('[WebSocket] Message sent:', message);
        this.updateMetrics({ messagesSent: this.metrics.messagesSent + 1 });
        return true;
      } catch (error) {
        console.error('[WebSocket] Failed to send message:', error);
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
    console.log('[WebSocket] Disconnecting...');
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