type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  timestamp: string;
  message: string;
  data?: any;
}

export class LoggingService {
  private static instance: LoggingService;
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;

  private constructor() {}

  static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  private formatLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      timestamp: new Date().toISOString(),
      message,
      data: data ? this.sanitizeData(data) : undefined
    };
  }

  private sanitizeData(data: any): any {
    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data };
      // Remove sensitive data
      delete sanitized.accessToken;
      delete sanitized.apiKey;
      return sanitized;
    }
    return data;
  }

  private addLog(entry: LogEntry) {
    this.logs.unshift(entry);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.pop();
    }
    console.log(`[${entry.level.toUpperCase()}] ${entry.message}`, entry.data || '');
  }

  debug(message: string, data?: any) {
    this.addLog(this.formatLogEntry('debug', message, data));
  }

  info(message: string, data?: any) {
    this.addLog(this.formatLogEntry('info', message, data));
  }

  warn(message: string, data?: any) {
    this.addLog(this.formatLogEntry('warn', message, data));
  }

  error(message: string, data?: any) {
    this.addLog(this.formatLogEntry('error', message, data));
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = LoggingService.getInstance();