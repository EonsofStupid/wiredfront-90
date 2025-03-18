
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
}

class LoggingService {
  private options: LogOptions = {
    level: 'info',
    enableConsole: true,
    enableRemote: false,
  };
  
  // Configure logger settings
  configure(options: Partial<LogOptions>) {
    this.options = { ...this.options, ...options };
  }
  
  // Debug level logs
  debug(message: string, data?: any) {
    if (['debug'].includes(this.options.level)) {
      this.log('debug', message, data);
    }
  }
  
  // Info level logs
  info(message: string, data?: any) {
    if (['debug', 'info'].includes(this.options.level)) {
      this.log('info', message, data);
    }
  }
  
  // Warning level logs
  warn(message: string, data?: any) {
    if (['debug', 'info', 'warn'].includes(this.options.level)) {
      this.log('warn', message, data);
    }
  }
  
  // Error level logs
  error(message: string, data?: any) {
    if (['debug', 'info', 'warn', 'error'].includes(this.options.level)) {
      this.log('error', message, data);
    }
  }
  
  // Main log function
  private log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logData = { timestamp, message, ...(data || {}) };
    
    if (this.options.enableConsole) {
      switch (level) {
        case 'debug':
          console.debug(`[${timestamp}] 🔍 DEBUG:`, message, data || '');
          break;
        case 'info':
          console.info(`[${timestamp}] ℹ️ INFO:`, message, data || '');
          break;
        case 'warn':
          console.warn(`[${timestamp}] ⚠️ WARNING:`, message, data || '');
          break;
        case 'error':
          console.error(`[${timestamp}] 🔴 ERROR:`, message, data || '');
          break;
      }
    }
    
    // Future implementation: send logs to a remote service
    if (this.options.enableRemote) {
      // TODO: Implement remote logging
    }
  }
}

// Create and export a singleton instance
export const logger = new LoggingService();
