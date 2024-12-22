import { WebSocketLogger } from '../WebSocketLogger';
import { toast } from 'sonner';

export class WebSocketMessageHandler {
  constructor(
    private logger: WebSocketLogger,
    private ws: WebSocket,
    private sessionId: string
  ) {}

  send(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        this.logger.info('Message sent', {
          sessionId: this.sessionId,
          messageType: message?.type,
          timestamp: new Date().toISOString()
        });
        return true;
      } catch (error) {
        this.logger.error('Failed to send message', {
          sessionId: this.sessionId,
          error,
          messageType: message?.type
        });
        toast.error('Failed to send message');
        return false;
      }
    }
    this.logger.warn('Message not sent - connection not ready', {
      sessionId: this.sessionId,
      connectionState: this.ws?.readyState
    });
    toast.error('Cannot send message - not connected');
    return false;
  }

  handleMessage(data: any) {
    this.logger.debug('Message received', {
      sessionId: this.sessionId,
      messageType: data?.type,
      timestamp: new Date().toISOString()
    });
    toast.success('Message received');
  }
}