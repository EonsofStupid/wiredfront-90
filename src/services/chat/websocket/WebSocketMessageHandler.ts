import { WebSocketLogger } from '../WebSocketLogger';
import { MessageSendError } from '../types/errors';
import { toast } from 'sonner';

export class WebSocketMessageHandler {
  private retryAttempts: Record<string, number> = {};
  private maxRetries = 3;

  constructor(
    private logger: WebSocketLogger,
    private ws: WebSocket,
    private sessionId: string
  ) {}

  async send(message: any): Promise<boolean> {
    const messageId = crypto.randomUUID();
    this.retryAttempts[messageId] = 0;

    const attempt = async (): Promise<boolean> => {
      try {
        if (this.ws?.readyState !== WebSocket.OPEN) {
          throw new MessageSendError(
            'Connection not ready',
            messageId,
            this.retryAttempts[messageId]
          );
        }

        this.ws.send(JSON.stringify(message));
        
        this.logger.logUIUpdate('MessageList', 'Message sent');
        delete this.retryAttempts[messageId];
        return true;

      } catch (error) {
        this.retryAttempts[messageId]++;
        
        this.logger.logMessageError(
          error as Error,
          messageId,
          this.retryAttempts[messageId]
        );

        if (this.retryAttempts[messageId] < this.maxRetries) {
          toast.error(`Retrying to send message (Attempt ${this.retryAttempts[messageId]}/${this.maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, this.retryAttempts[messageId])));
          return attempt();
        }

        toast.error('Failed to send message after multiple attempts');
        delete this.retryAttempts[messageId];
        return false;
      }
    };

    return attempt();
  }

  handleMessage(data: any) {
    try {
      this.logger.logUIUpdate('MessageList', 'Message received');
      
      if (data.type === 'error') {
        toast.error(data.message || 'Message error occurred');
        this.logger.logMessageError(
          new Error(data.message || 'Unknown error'),
          data.messageId || 'unknown',
          0
        );
      } else {
        toast.success('Message received');
      }
    } catch (error) {
      this.logger.logMessageError(error as Error, 'unknown', 0);
      toast.error('Failed to process message');
    }
  }
}