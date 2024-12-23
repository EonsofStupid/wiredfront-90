type LogLevel = 'info' | 'error' | 'debug' | 'warn';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, any>;
}

export const logger = {
  formatError(error: any) {
    if (!error) return null;
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error.cause && { cause: this.formatError(error.cause) })
    };
  },

  log(level: LogLevel, message: string, metadata: Record<string, any> = {}) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata: metadata.error ? { ...metadata, error: this.formatError(metadata.error) } : metadata
    };

    console.log(JSON.stringify(entry));
    return entry;
  },

  info(message: string, metadata = {}) {
    return this.log('info', message, metadata);
  },

  error(message: string, metadata = {}) {
    return this.log('error', message, metadata);
  },

  debug(message: string, metadata = {}) {
    return this.log('debug', message, metadata);
  },

  warn(message: string, metadata = {}) {
    return this.log('warn', message, metadata);
  }
};