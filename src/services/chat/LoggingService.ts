
interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
  timestamp: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 100;
  private debugMode: boolean = process.env.NODE_ENV === 'development';
  
  constructor() {
    // Initialize logger
    this.info('Logger initialized');
  }
  
  info(message: string, data?: any): void {
    this.log('info', message, data);
    if (this.debugMode) {
      console.info(`[INFO] ${message}`, data || '');
    }
  }
  
  warn(message: string, data?: any): void {
    this.log('warn', message, data);
    if (this.debugMode) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  }
  
  error(message: string, data?: any): void {
    this.log('error', message, data);
    console.error(`[ERROR] ${message}`, data || '');
  }
  
  debug(message: string, data?: any): void {
    if (this.debugMode) {
      this.log('debug', message, data);
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  }
  
  private log(level: 'info' | 'warn' | 'error' | 'debug', message: string, data?: any): void {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    
    this.logs.unshift(entry);
    
    // Trim logs to prevent memory leaks
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }
  
  getLogs(): LogEntry[] {
    return [...this.logs];
  }
  
  clearLogs(): void {
    this.logs = [];
    this.info('Logs cleared');
  }
}

export const logger = new Logger();
