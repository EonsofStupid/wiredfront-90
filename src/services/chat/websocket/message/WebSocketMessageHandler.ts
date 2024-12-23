import { logger } from '../../LoggingService';

export class WebSocketMessageHandler {
  private onMessage?: (data: any) => void;

  constructor(private sessionId: string) {}

  setCallback(callback: (data: any) => void) {
    this.onMessage = callback;
  }

  handleMessage(data: string) {
    try {
      const parsedData = JSON.parse(data);
      this.onMessage?.(parsedData);
      
      logger.debug('Message processed', {
        sessionId: this.sessionId,
        context: { component: 'WebSocketMessageHandler', action: 'handleMessage' }
      });
    } catch (error) {
      logger.error('Failed to process message', {
        error,
        sessionId: this.sessionId,
        rawData: data,
        context: { component: 'WebSocketMessageHandler', action: 'handleMessage' }
      });
    }
  }
}