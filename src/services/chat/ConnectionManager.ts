import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { toast } from 'sonner';

export class ConnectionManager {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
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

  private connectionState: ConnectionState = 'initial';
  
  constructor(url: string) {
    this.url = url;
  }

  public onStateChange: ((state: ConnectionState) => void) | null = null;
  public onMessage: ((data: any) => void) | null = null;

  private updateState(newState: ConnectionState) {
    this.connectionState = newState;
    if (this.onStateChange) {
      this.onStateChange(newState);
    }
  }

  public connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      this.updateState('connecting');
      console.log('Connecting to WebSocket:', this.url);
      
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected successfully');
        this.metrics.lastConnected = new Date();
        this.reconnectAttempts = 0;
        this.updateState('connected');
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        this.metrics.messagesReceived++;
        if (this.onMessage) {
          try {
            const data = JSON.parse(event.data);
            this.onMessage(data);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.metrics.lastError = error as Error;
        this.handleError(error);
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        this.updateState('disconnected');
        this.handleClose(event);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.handleError(error as Error);
    }
  }

  private handleError(error: Error | Event) {
    this.metrics.lastError = error as Error;
    
    if (this.connectionState === 'connected') {
      this.updateState('error');
      toast.error('Connection error occurred. Attempting to reconnect...');
    }
    
    this.attemptReconnect();
  }

  private handleClose(event: CloseEvent) {
    if (this.connectionState !== 'disconnected') {
      this.updateState('disconnected');
    }

    // Don't attempt to reconnect if the closure was clean
    if (event.code !== 1000) {
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      toast.error('Unable to establish connection. Please try again later.');
      this.updateState('error');
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectAttempts++;
    this.metrics.reconnectAttempts = this.reconnectAttempts;
    
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
    
    this.updateState('reconnecting');
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startHeartbeat() {
    setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        const startTime = Date.now();
        this.ws.send(JSON.stringify({ type: 'ping' }));
        this.metrics.lastHeartbeat = new Date();
        this.metrics.latency = Date.now() - startTime;
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  public send(data: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(data));
        this.metrics.messagesSent++;
        return true;
      } catch (error) {
        console.error('Failed to send message:', error);
        return false;
      }
    }
    return false;
  }

  public getWebSocket() {
    return this.ws;
  }

  public getMetrics(): ConnectionMetrics {
    if (this.metrics.lastConnected) {
      this.metrics.uptime = Date.now() - this.metrics.lastConnected.getTime();
    }
    return { ...this.metrics };
  }

  public reconnect() {
    if (this.ws) {
      this.ws.close();
    }
    this.connect();
  }

  public destroy() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}