import { logger } from './LoggingService';

export class WebSocketMessageHandler {
  private sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    logger.info('WebSocket message handler initialized', { sessionId }, this.sessionId);
  }

  handleMessage(data: string, callback: (data: any) => void) {
    try {
      logger.debug('Processing WebSocket message', { data }, this.sessionId);
      const parsedData = JSON.parse(data);
      
      if (parsedData.type === 'pong') {
        logger.debug('Received pong message', undefined, this.sessionId);
        return;
      }

      logger.info('Handling WebSocket message', { type: parsedData.type }, this.sessionId);
      callback(parsedData);
    } catch (error) {
      logger.error('Failed to parse WebSocket message', { error, data }, this.sessionId);
    }
  }

  handleError(error: Error) {
    logger.error('WebSocket error occurred', { error }, this.sessionId);
  }

  handleClose(event: CloseEvent) {
    logger.info('WebSocket connection closed', {
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean
    }, this.sessionId);
  }
}