import { logger } from './LoggingService';

export class WebSocketMessageHandler {
  private sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    logger.info('WebSocket message handler initialized',
      { sessionId },
      sessionId,
      { component: 'WebSocketMessageHandler', action: 'initialize' }
    );
  }

  handleMessage(data: string, callback: (data: any) => void) {
    try {
      logger.debug('Processing WebSocket message',
        { 
          rawData: data,
          timestamp: new Date().toISOString()
        },
        this.sessionId,
        { component: 'WebSocketMessageHandler', action: 'handleMessage' }
      );
      const parsedData = JSON.parse(data);
      
      if (parsedData.type === 'pong') {
        logger.debug('Received pong message',
          {
            timestamp: new Date().toISOString()
          },
          this.sessionId,
          { component: 'WebSocketMessageHandler', action: 'handleMessage' }
        );
        return;
      }

      logger.info('Handling WebSocket message',
        { 
          type: parsedData.type,
          messageId: parsedData.id,
          timestamp: new Date().toISOString()
        },
        this.sessionId,
        { component: 'WebSocketMessageHandler', action: 'handleMessage' }
      );
      callback(parsedData);
    } catch (error) {
      logger.error('Failed to parse WebSocket message',
        { 
          error,
          rawData: data,
          timestamp: new Date().toISOString()
        },
        this.sessionId,
        { component: 'WebSocketMessageHandler', action: 'handleMessage', error: error as Error }
      );
    }
  }

  handleError(error: Error) {
    logger.error('WebSocket error occurred',
      { 
        error,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketMessageHandler', action: 'handleError', error }
    );
  }

  handleClose(event: CloseEvent) {
    logger.info('WebSocket connection closed',
      {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketMessageHandler', action: 'handleClose' }
    );
  }
}