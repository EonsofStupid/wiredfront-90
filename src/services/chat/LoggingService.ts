type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  timestamp: string;
  message: string;
  data?: any;
  sessionId?: string;
  userId?: string;
  context?: {
    component?: string;
    action?: string;
    state?: string;
    error?: Error;
  };
}

export class LoggingService {
  private static instance: LoggingService;
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;
  private logToConsole = true;

  private constructor() {}

  static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  private formatLogEntry(
    level: LogLevel, 
    message: string, 
    data?: any, 
    sessionId?: string,
    context?: LogEntry['context']
  ): LogEntry {
    const entry: LogEntry = {
      level,
      timestamp: new Date().toISOString(),
      message,
      sessionId,
      data: data ? this.sanitizeData(data) : undefined,
      context
    };

    if (this.logToConsole) {
      const logPrefix = `[${entry.level.toUpperCase()}]${sessionId ? ` [Session: ${sessionId}]` : ''}`;
      const contextStr = context ? ` [${Object.entries(context).map(([k,v]) => `${k}:${v}`).join(', ')}]` : '';
      const logMessage = `${logPrefix}${contextStr} ${entry.message}`;
      
      switch (level) {
        case 'debug':
          console.debug(logMessage, entry.data || '');
          break;
        case 'info':
          console.info(logMessage, entry.data || '');
          break;
        case 'warn':
          console.warn(logMessage, entry.data || '');
          break;
        case 'error':
          console.error(logMessage, entry.data || '');
          if (context?.error?.stack) {
            console.error(context.error.stack);
          }
          break;
      }
    }

    return entry;
  }

  private sanitizeData(data: any): any {
    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data };
      // Remove sensitive data
      delete sanitized.accessToken;
      delete sanitized.apiKey;
      delete sanitized.password;
      delete sanitized.secret;
      return sanitized;
    }
    return data;
  }

  private addLog(entry: LogEntry) {
    this.logs.unshift(entry);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.pop();
    }
  }

  debug(message: string, data?: any, sessionId?: string, context?: LogEntry['context']) {
    const entry = this.formatLogEntry('debug', message, data, sessionId, context);
    this.addLog(entry);
  }

  info(message: string, data?: any, sessionId?: string, context?: LogEntry['context']) {
    const entry = this.formatLogEntry('info', message, data, sessionId, context);
    this.addLog(entry);
  }

  warn(message: string, data?: any, sessionId?: string, context?: LogEntry['context']) {
    const entry = this.formatLogEntry('warn', message, data, sessionId, context);
    this.addLog(entry);
  }

  error(message: string, data?: any, sessionId?: string, context?: LogEntry['context']) {
    const entry = this.formatLogEntry('error', message, data, sessionId, context);
    this.addLog(entry);
  }

  getLogs(filter?: { 
    level?: LogLevel; 
    sessionId?: string;
    component?: string;
    timeRange?: { start: Date; end: Date };
  }): LogEntry[] {
    let filtered = [...this.logs];
    
    if (filter?.level) {
      filtered = filtered.filter(log => log.level === filter.level);
    }
    
    if (filter?.sessionId) {
      filtered = filtered.filter(log => log.sessionId === filter.sessionId);
    }

    if (filter?.component) {
      filtered = filtered.filter(log => log.context?.component === filter.component);
    }

    if (filter?.timeRange) {
      filtered = filtered.filter(log => {
        const logTime = new Date(log.timestamp);
        return logTime >= filter.timeRange!.start && logTime <= filter.timeRange!.end;
      });
    }
    
    return filtered;
  }

  clearLogs() {
    this.logs = [];
  }

  setLogToConsole(enabled: boolean) {
    this.logToConsole = enabled;
  }
}

export const logger = LoggingService.getInstance();