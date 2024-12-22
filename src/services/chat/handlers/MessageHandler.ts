import { logger } from '../LoggingService';

export class MessageHandler {
  private sessionId: string;
  private onMessageCallback: ((message: any) => void) | null = null;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  setCallback(callback: (message: any) => void) {
    this.onMessageCallback = callback;
  }

  handleMessage(data: string) {
    try {
      logger.debug('Processing WebSocket message',
        { 
          data,
          timestamp: new Date().toISOString()
        },
        this.sessionId,
        { component: 'MessageHandler', action: 'handleMessage' }
      );
      
      const parsedData = JSON.parse(data);
      
      if (this.onMessageCallback) {
        this.onMessageCallback(parsedData);
      }
    } catch (error) {
      logger.error('Failed to parse WebSocket message',
        { 
          error,
          data,
          timestamp: new Date().toISOString()
        },
        this.sessionId,
        { component: 'MessageHandler', action: 'handleMessage', error: error as Error }
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
      { component: 'MessageHandler', action: 'handleError', error }
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
      { component: 'MessageHandler', action: 'handleClose' }
    );
  }
}