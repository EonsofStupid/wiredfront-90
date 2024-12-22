export const logger = {
  log: (level: string, message: string, data?: Record<string, unknown>) => {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...data
    }));
  },
  info: (message: string, data?: Record<string, unknown>) => {
    logger.log('INFO', message, data);
  },
  error: (message: string, error?: unknown, data?: Record<string, unknown>) => {
    logger.log('ERROR', message, {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
      ...data,
    });
  },
  debug: (message: string, data?: Record<string, unknown>) => {
    logger.log('DEBUG', message, data);
  },
  warn: (message: string, data?: Record<string, unknown>) => {
    logger.log('WARN', message, data);
  }
};