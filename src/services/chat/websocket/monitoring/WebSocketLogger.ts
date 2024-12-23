type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export class WebSocketLogger {
  private static instance: WebSocketLogger;

  private constructor() {}

  static getInstance(): WebSocketLogger {
    if (!WebSocketLogger.instance) {
      WebSocketLogger.instance = new WebSocketLogger();
    }
    return WebSocketLogger.instance;
  }

  log(level: LogLevel, message: string, metadata?: Record<string, any>) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...metadata
    };

    switch (level) {
      case 'debug':
        console.debug(`[${timestamp}] ${message}`, metadata);
        break;
      case 'info':
        console.info(`[${timestamp}] ${message}`, metadata);
        break;
      case 'warn':
        console.warn(`[${timestamp}] ${message}`, metadata);
        break;
      case 'error':
        console.error(`[${timestamp}] ${message}`, metadata);
        break;
    }

    return logData;
  }
}