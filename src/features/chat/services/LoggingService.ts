
/**
 * Chat-specific logging service
 */
import { MessageRole } from '@/types/chat';

// Log levels
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

// Log metadata
interface LogMeta {
  [key: string]: any;
}

// Basic log function that respects environment
const log = (level: LogLevel, message: string, meta?: LogMeta) => {
  const isDev = import.meta.env.DEV;
  const logPrefix = '[Chat]';
  
  // Don't log in production unless specified
  if (!isDev && level === 'debug') return;
  
  // Format metadata if present
  const metaString = meta ? ` ${JSON.stringify(meta)}` : '';
  
  switch (level) {
    case 'info':
      console.info(`${logPrefix} ${message}${metaString}`);
      break;
    case 'warn':
      console.warn(`${logPrefix} ${message}${metaString}`);
      break;
    case 'error':
      console.error(`${logPrefix} ${message}${metaString}`);
      break;
    case 'debug':
      console.debug(`${logPrefix} ${message}${metaString}`);
      break;
  }
};

// Export the logger interface
export const logger = {
  info: (message: string, meta?: LogMeta) => log('info', message, meta),
  warn: (message: string, meta?: LogMeta) => log('warn', message, meta),
  error: (message: string, meta?: LogMeta) => log('error', message, meta),
  debug: (message: string, meta?: LogMeta) => log('debug', message, meta),
};
