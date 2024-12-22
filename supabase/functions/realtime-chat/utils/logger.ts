type LogLevel = 'info' | 'error' | 'debug' | 'warn';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  requestId?: string;
  userId?: string;
  sessionId?: string;
  error?: any;
  context?: Record<string, any>;
}

export const logger = {
  formatError(error: any) {
    if (!error) return null;
    
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
      details: error.details,
      hint: error.hint,
      ...(error.cause && { cause: this.formatError(error.cause) })
    };
  },

  createLogEntry(
    level: LogLevel,
    message: string,
    context: Record<string, any> = {}
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context
    };

    if (context.error) {
      entry.error = this.formatError(context.error);
    }

    console.log(JSON.stringify(entry, null, 2));
    return entry;
  },

  info(message: string, context: Record<string, any> = {}) {
    return this.createLogEntry('info', message, context);
  },

  error(message: string, context: Record<string, any> = {}) {
    return this.createLogEntry('error', message, context);
  },

  debug(message: string, context: Record<string, any> = {}) {
    return this.createLogEntry('debug', message, context);
  },

  warn(message: string, context: Record<string, any> = {}) {
    return this.createLogEntry('warn', message, context);
  }
};