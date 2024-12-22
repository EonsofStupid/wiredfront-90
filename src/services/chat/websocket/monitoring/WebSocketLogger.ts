import { logger } from '../../LoggingService';

export class WebSocketLogger {
  constructor(private sessionId: string) {}

  info(message: string, metadata: Record<string, any> = {}) {
    logger.info(message, {
      ...metadata,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      component: 'WebSocketService'
    });
  }

  error(message: string, metadata: Record<string, any> = {}) {
    logger.error(message, {
      ...metadata,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      component: 'WebSocketService'
    });
  }

  debug(message: string, metadata: Record<string, any> = {}) {
    logger.debug(message, {
      ...metadata,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      component: 'WebSocketService'
    });
  }

  warn(message: string, metadata: Record<string, any> = {}) {
    logger.warn(message, {
      ...metadata,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      component: 'WebSocketService'
    });
  }
}