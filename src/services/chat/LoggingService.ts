
import { supabase } from "@/integrations/supabase/client";

export interface LogOptions {
  source?: string;
  metadata?: Record<string, any>;
  userId?: string;
  [key: string]: any; // Allow any additional properties
}

class Logger {
  private defaultSource: string = 'application';

  /**
   * Logs an informational message
   */
  async info(message: string, options?: LogOptions) {
    return this.log('info', message, options);
  }

  /**
   * Logs a warning message
   */
  async warn(message: string, options?: LogOptions) {
    return this.log('warn', message, options);
  }

  /**
   * Logs an error message
   */
  async error(message: string, options?: LogOptions) {
    return this.log('error', message, options);
  }

  /**
   * Logs a debug message (only recorded in development environment or when debug mode is enabled)
   */
  async debug(message: string, options?: LogOptions) {
    // Check if we're in development mode or if debug is enabled
    const isDev = import.meta.env.DEV;
    if (isDev) {
      console.debug(`[DEBUG] ${message}`, options?.metadata || {});
    }
    
    return this.log('debug', message, options);
  }

  /**
   * Logs a message to console and Supabase system_logs table
   */
  private async log(level: 'info' | 'warn' | 'error' | 'debug', message: string, options?: LogOptions) {
    const source = options?.source || this.defaultSource;
    const metadata = options?.metadata || {};
    const userId = options?.userId || await this.getCurrentUserId();
    
    // Always log to console
    this.logToConsole(level, message, source, metadata);
    
    // Try to log to database
    try {
      const { error } = await supabase.from('system_logs').insert({
        level,
        source,
        message,
        metadata,
        user_id: userId
      } as any); // Type assertion since table might not be in types
      
      if (error) {
        console.error('Failed to write log to database:', error);
      }
    } catch (err) {
      console.error('Error logging to database:', err);
    }
  }

  /**
   * Logs a message to the console with appropriate formatting
   */
  private logToConsole(level: 'info' | 'warn' | 'error' | 'debug', message: string, source: string, metadata: any) {
    const timestamp = new Date().toISOString();
    const logPrefix = `[${timestamp}] [${level.toUpperCase()}] [${source}]`;
    
    switch (level) {
      case 'info':
        console.info(`${logPrefix} ${message}`, metadata);
        break;
      case 'warn':
        console.warn(`${logPrefix} ${message}`, metadata);
        break;
      case 'error':
        console.error(`${logPrefix} ${message}`, metadata);
        break;
      case 'debug':
        console.debug(`${logPrefix} ${message}`, metadata);
        break;
    }
  }

  /**
   * Gets the current user ID if available
   */
  private async getCurrentUserId(): Promise<string | null> {
    try {
      const { data } = await supabase.auth.getSession();
      return data?.session?.user?.id || null;
    } catch {
      return null;
    }
  }
}

export const logger = new Logger();
