
/**
 * Logging service for the chat system
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
}

class ChatLogger {
  private isEnabled: boolean = true;
  private logLevel: LogLevel = 'info';
  private logHistory: LogOptions[] = [];
  
  constructor() {
    // Initialize logger with environment settings
    this.isEnabled = process.env.NODE_ENV !== 'production' || 
                     localStorage.getItem('debug_logging') === 'true';
    
    const storedLevel = localStorage.getItem('log_level');
    if (storedLevel && ['debug', 'info', 'warn', 'error'].includes(storedLevel)) {
      this.logLevel = storedLevel as LogLevel;
    }
  }
  
  /**
   * Enable or disable logging
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    localStorage.setItem('debug_logging', enabled.toString());
  }
  
  /**
   * Set the minimum log level
   */
  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
    localStorage.setItem('log_level', level);
  }
  
  /**
   * Log a debug message
   */
  public debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }
  
  /**
   * Log an info message
   */
  public info(message: string, data?: any): void {
    this.log('info', message, data);
  }
  
  /**
   * Log a warning message
   */
  public warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }
  
  /**
   * Log an error message
   */
  public error(message: string, data?: any): void {
    this.log('error', message, data);
  }
  
  /**
   * Get all logs
   */
  public getLogs(): LogOptions[] {
    return this.logHistory;
  }
  
  /**
   * Clear all logs
   */
  public clearLogs(): void {
    this.logHistory = [];
  }
  
  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, data?: any): void {
    if (!this.isEnabled) return;
    
    const logLevels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    
    // Only log if level is at or above the configured level
    if (logLevels[level] < logLevels[this.logLevel]) return;
    
    const logOptions: LogOptions = {
      level,
      message,
      data,
      timestamp: new Date().toISOString()
    };
    
    this.logHistory.push(logOptions);
    
    // Trim log history if it gets too large
    if (this.logHistory.length > 1000) {
      this.logHistory = this.logHistory.slice(-500);
    }
    
    // Write to console
    const consoleMethod = level === 'debug' ? 'log' : level;
    console[consoleMethod as keyof Console](`[${level.toUpperCase()}] ${message}`, data || '');
  }
}

// Singleton instance
export const logger = new ChatLogger();
