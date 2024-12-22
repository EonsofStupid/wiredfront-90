import { WebSocketLogger } from '../WebSocketLogger';
import { toast } from 'sonner';

export class WebSocketMessageHandler {
  constructor(
    private logger: WebSocketLogger,
    private ws: WebSocket,
    private sessionId: string
  ) {}

  send(message: any): boolean {
    const messageId = crypto.randomUUID();
    
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.logger.logMessageAttempt(messageId, {
          type: message?.type,
          timestamp: new Date().toISOString()
        });

        this.ws.send(JSON.stringify(message));
        
        this.logger.logMessageSent(messageId, {
          type: message?.type,
          timestamp: new Date().toISOString()
        });
        
        return true;
      } catch (error) {
        this.logger.logMessageError(error as Error, messageId, {
          type: message?.type,
          timestamp: new Date().toISOString()
        });
        
        toast.error('Failed to send message');
        return false;
      }
    }

    this.logger.logMessageError(
      new Error('Connection not ready'),
      messageId,
      {
        state: this.ws?.readyState,
        timestamp: new Date().toISOString()
      }
    );
    
    toast.error('Cannot send message - not connected');
    return false;
  }

  handleMessage(data: any) {
    const messageId = crypto.randomUUID();
    
    this.logger.logMessageReceived(messageId, {
      type: data?.type,
      timestamp: new Date().toISOString()
    });
    
    if (data.type === 'error') {
      toast.error(data.message || 'Message error occurred');
    } else {
      toast.success('Message received');
    }
  }
}