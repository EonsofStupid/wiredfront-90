import { toast } from 'sonner';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { WEBSOCKET_URL, RECONNECT_INTERVALS, MAX_RECONNECT_ATTEMPTS, HEARTBEAT_INTERVAL } from '@/constants/websocket';

export class ConnectionManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
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
  private projectId: string;
  
  constructor(projectId: string) {
    this.projectId = projectId;
    this.setupHeartbeat();
  }

  public onStateChange: ((state: ConnectionState) => void) | null = null;
  public onMessage: ((data: any) => void) | null = null;

  private updateState(newState: ConnectionState) {
    this.connectionState = newState;
    if (this.onStateChange) {
      this.onStateChange(newState);
    }

    switch (newState) {
      case 'connected':
        toast.success('Connected to chat service');
        break;
      case 'disconnected':
        toast.error('Disconnected from chat service');
        break;
      case 'reconnecting':
        toast.info('Attempting to reconnect...');
        break;
      case 'error':
        toast.error('Connection error occurred');
        break;
    }
  }

  private setupHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        const startTime = Date.now();
        this.ws.send(JSON.stringify({ type: 'ping' }));
        this.metrics.lastHeartbeat = new Date();
        this.metrics.latency = Date.now() - startTime;
      }
    }, HEARTBEAT_INTERVAL);
  }

  public connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      this.updateState('connecting');
      const wsUrl = `${WEBSOCKET_URL}?project_id=${this.projectId}`;
      console.log('Connecting to WebSocket:', wsUrl);
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected successfully');
        this.metrics.lastConnected = new Date();
        this.reconnectAttempts = 0;
        this.updateState('connected');
        this.setupHeartbeat();
      };

      this.ws.onmessage = (event) => {
        this.metrics.messagesReceived++;
        if (this.onMessage) {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'pong') {
              this.metrics.latency = Date.now() - this.metrics.lastHeartbeat!.getTime();
              return;
            }
            this.onMessage(data);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        }
      };

      this.ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        const error = new Error('WebSocket connection error');
        this.metrics.lastError = error;
        
        if (this.connectionState === 'connected') {
          this.updateState('error');
        }
        
        this.attemptReconnect();
      };

      this.ws.onclose = (event) => {
        if (this.connectionState !== 'disconnected') {
          this.updateState('disconnected');
        }

        if (event.code !== 1000) {
          this.attemptReconnect();
        }
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.handleError(error as Error);
    }
  }

  private handleError(error: Error) {
    this.metrics.lastError = error;
    if (this.connectionState === 'connected') {
      this.updateState('error');
    }
    this.attemptReconnect();
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('Max reconnection attempts reached');
      toast.error('Unable to establish connection. Please try again later.');
      this.updateState('error');
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    const delay = RECONNECT_INTERVALS[this.reconnectAttempts] || RECONNECT_INTERVALS[RECONNECT_INTERVALS.length - 1];
    this.reconnectAttempts++;
    this.metrics.reconnectAttempts = this.reconnectAttempts;
    
    this.updateState('reconnecting');
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  public send(data: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(data));
        this.metrics.messagesSent++;
        return true;
      } catch (error) {
        console.error('Failed to send message:', error);
        toast.error('Failed to send message');
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
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}