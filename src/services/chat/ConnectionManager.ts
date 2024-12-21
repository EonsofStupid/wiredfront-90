import { toast } from "sonner";
import { ConnectionState, ConnectionMetrics } from "@/types/websocket";
import { calculateRetryDelay } from "@/hooks/chat/utils/websocket";

export class ConnectionManager {
  private ws: WebSocket | null = null;
  private heartbeatInterval: number | null = null;
  private reconnectTimeout: number | null = null;
  private retryAttempts = 0;
  private readonly maxRetries = 5;
  private readonly heartbeatIntervalMs = 60000;
  private readonly url: string;
  private connectionState: ConnectionState = 'initial';
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

  constructor(url: string) {
    this.url = url;
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      if (this.connectionState === 'disconnected') {
        this.reconnect();
      }
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatInterval = window.setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        const pingTime = Date.now();
        this.ws.send(JSON.stringify({ type: 'ping', timestamp: pingTime }));
      }
    }, this.heartbeatIntervalMs);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private updateState(state: ConnectionState) {
    this.connectionState = state;
    this.onStateChange?.(state);
  }

  private handleOpen() {
    this.updateState('connected');
    this.retryAttempts = 0;
    this.metrics.lastConnected = new Date();
    this.startHeartbeat();
    toast.success('Connected to chat service');
  }

  private handleClose() {
    this.updateState('disconnected');
    this.stopHeartbeat();
    
    if (this.retryAttempts < this.maxRetries) {
      const delay = calculateRetryDelay(this.retryAttempts);
      this.reconnectTimeout = window.setTimeout(() => {
        this.reconnect();
      }, delay);
    } else {
      toast.error('Connection lost. Max retries exceeded.');
    }
  }

  private handleError(error: Event) {
    console.error('WebSocket error:', error);
    this.metrics.lastError = error instanceof Error ? error : new Error('WebSocket error');
    this.metrics.reconnectAttempts = this.retryAttempts;
    toast.error('Connection error occurred');
  }

  public connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.updateState('connecting');
    this.ws = new WebSocket(this.url);

    this.ws.onopen = this.handleOpen.bind(this);
    this.ws.onclose = this.handleClose.bind(this);
    this.ws.onerror = this.handleError.bind(this);
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'pong') {
          this.metrics.lastHeartbeat = new Date();
          this.metrics.latency = Date.now() - data.timestamp;
        }
        this.metrics.messagesReceived++;
        this.onMessage?.(data);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
  }

  public disconnect() {
    this.stopHeartbeat();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.updateState('disconnected');
  }

  public reconnect() {
    this.disconnect();
    this.retryAttempts++;
    this.connect();
  }

  public send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      this.metrics.messagesSent++;
      return true;
    }
    return false;
  }

  public getState() {
    return this.connectionState;
  }

  public getMetrics() {
    return { ...this.metrics };
  }

  public getWebSocket(): WebSocket | null {
    return this.ws;
  }

  public onStateChange?: (state: ConnectionState) => void;
  public onMessage?: (message: any) => void;

  public destroy() {
    this.disconnect();
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }
}
