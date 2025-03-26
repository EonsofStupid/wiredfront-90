
/**
 * Centralized logging service
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogPayload {
  message: string;
  level: LogLevel;
  timestamp: string;
  data?: any;
}

// Configuration for logging behavior
const config = {
  // Minimum log level to display in console
  consoleLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  
  // Whether to send logs to server
  enableServerLogging: true,
  
  // Log retention in localStorage
  localRetentionCount: 100,
  
  // Whether to add source information (file, line)
  includeSource: process.env.NODE_ENV === 'development',
};

// Logger implementation
class Logger {
  private logQueue: LogPayload[] = [];
  private isSending = false;
  private localLogs: LogPayload[] = [];
  
  constructor() {
    // Load saved logs from localStorage if available
    try {
      const savedLogs = localStorage.getItem('app_logs');
      if (savedLogs) {
        this.localLogs = JSON.parse(savedLogs);
      }
    } catch (e) {
      console.error('Failed to load saved logs', e);
      this.localLogs = [];
    }
  }
  
  /**
   * Log at debug level
   */
  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }
  
  /**
   * Log at info level
   */
  info(message: string, data?: any) {
    this.log('info', message, data);
  }
  
  /**
   * Log at warn level
   */
  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }
  
  /**
   * Log at error level
   */
  error(message: string, data?: any) {
    this.log('error', message, data);
  }
  
  /**
   * Central logging method
   */
  private log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    
    // Create log payload
    const payload: LogPayload = {
      message,
      level,
      timestamp,
      data
    };
    
    // Console output
    this.consoleOutput(level, message, data);
    
    // Store locally
    this.storeLocally(payload);
    
    // Queue for server if enabled
    if (config.enableServerLogging) {
      this.queueForServer(payload);
    }
  }
  
  /**
   * Output to console based on configured level
   */
  private consoleOutput(level: LogLevel, message: string, data?: any) {
    const levelPriority = { debug: 0, info: 1, warn: 2, error: 3 };
    const configLevelPriority = levelPriority[config.consoleLevel];
    
    if (levelPriority[level] >= configLevelPriority) {
      const consoleMethod = console[level] || console.log;
      
      if (data !== undefined) {
        consoleMethod(`[${level.toUpperCase()}] ${message}`, data);
      } else {
        consoleMethod(`[${level.toUpperCase()}] ${message}`);
      }
    }
  }
  
  /**
   * Store logs locally for persistence between sessions
   */
  private storeLocally(payload: LogPayload) {
    this.localLogs.unshift(payload);
    
    // Trim to configured limit
    if (this.localLogs.length > config.localRetentionCount) {
      this.localLogs = this.localLogs.slice(0, config.localRetentionCount);
    }
    
    // Save to localStorage
    try {
      localStorage.setItem('app_logs', JSON.stringify(this.localLogs));
    } catch (e) {
      console.error('Failed to save logs to localStorage', e);
    }
  }
  
  /**
   * Queue log for sending to server
   */
  private queueForServer(payload: LogPayload) {
    this.logQueue.push(payload);
    this.processSendQueue();
  }
  
  /**
   * Process the send queue
   */
  private async processSendQueue() {
    if (this.isSending || this.logQueue.length === 0) return;
    
    this.isSending = true;
    
    try {
      // TODO: Implement actual server logging with Supabase
      // For now, just clear the queue
      this.logQueue = [];
    } catch (e) {
      console.error('Failed to send logs to server', e);
    } finally {
      this.isSending = false;
      
      // Process any new logs that came in while sending
      if (this.logQueue.length > 0) {
        setTimeout(() => this.processSendQueue(), 1000);
      }
    }
  }
  
  /**
   * Get locally stored logs
   */
  getLocalLogs() {
    return [...this.localLogs];
  }
  
  /**
   * Clear locally stored logs
   */
  clearLocalLogs() {
    this.localLogs = [];
    localStorage.removeItem('app_logs');
  }
}

// Create singleton instance
export const logger = new Logger();
