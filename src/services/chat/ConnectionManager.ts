import { toast } from 'sonner';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { WEBSOCKET_URL, RECONNECT_INTERVALS, MAX_RECONNECT_ATTEMPTS, HEARTBEAT_INTERVAL } from '@/constants/websocket';
import { supabase } from "@/integrations/supabase/client";
import { WebSocketMessageHandler } from './WebSocketMessageHandler';
import { HeartbeatManager } from './HeartbeatManager';
import { MetricsTracker } from './MetricsTracker';

export class ConnectionManager {
  private ws: WebSocket | null = null;
  private messageHandler: WebSocketMessageHandler;
  private heartbeatManager: HeartbeatManager;
  private metricsTracker: MetricsTracker;
  private reconnectAttempts = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private projectId: string;
  
  constructor(projectId: string) {
    this.projectId = projectId;
    this.messageHandler = new WebSocketMessageHandler();
    this.heartbeatManager = new HeartbeatManager();
    this.metricsTracker = new MetricsTracker();
    this.setupHeartbeat();
  }

  public onStateChange: ((state: ConnectionState) => void) | null = null;
  public onMessage: ((data: any) => void) | null = null;

  private updateState(newState: ConnectionState) {
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
    this.heartbeatManager.setup(this.ws, () => {
      this.metricsTracker.updateLastHeartbeat();
    });
  }

  public async connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      this.updateState('connecting');
      
      // Get the current session and access token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const wsUrl = `${WEBSOCKET_URL}?project_id=${this.projectId}&access_token=${session.access_token}`;
      console.log('Connecting to WebSocket:', wsUrl);
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected successfully');
        this.metricsTracker.setLastConnected();
        this.reconnectAttempts = 0;
        this.updateState('connected');
        this.setupHeartbeat();
      };

      this.ws.onmessage = (event) => {
        this.metricsTracker.incrementMessagesReceived();
        if (this.onMessage) {
          this.messageHandler.handleMessage(event.data, this.onMessage);
        }
      };

      this.ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        this.metricsTracker.setLastError(new Error('WebSocket connection error'));
        this.updateState('error');
        this.attemptReconnect();
      };

      this.ws.onclose = (event) => {
        this.updateState('disconnected');
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
    this.metricsTracker.setLastError(error);
    this.updateState('error');
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
    this.metricsTracker.setReconnectAttempts(this.reconnectAttempts);
    
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
        this.metricsTracker.incrementMessagesSent();
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
    return this.metricsTracker.getMetrics();
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
    this.heartbeatManager.destroy();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}