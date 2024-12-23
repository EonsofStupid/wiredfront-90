type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

export const logger = {
  formatError(error: any): any {
    if (!error) return null;
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error.cause && { cause: this.formatError(error.cause) })
    };
  },

  log(level: LogLevel, message: string, data: any = {}) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data: data.error ? { ...data, error: this.formatError(data.error) } : data
    };

    console.log(JSON.stringify(entry));
    return entry;
  },

  debug(message: string, data = {}) {
    return this.log('debug', message, data);
  },

  info(message: string, data = {}) {
    return this.log('info', message, data);
  },

  warn(message: string, data = {}) {
    return this.log('warn', message, data);
  },

  error(message: string, data = {}) {
    return this.log('error', message, data);
  }
};