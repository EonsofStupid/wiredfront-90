import { logger } from '../../LoggingService';

export class WebSocketMessageHandler {
  constructor(
    private sessionId: string,
    private onMessage?: (data: any) => void
  ) {}

  handleMessage(data: string) {
    try {
      logger.debug('Processing WebSocket message', {
        sessionId: this.sessionId,
        context: { component: 'WebSocketMessageHandler', action: 'handleMessage' }
      });

      const parsedData = JSON.parse(data);
      this.onMessage?.(parsedData);
      
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