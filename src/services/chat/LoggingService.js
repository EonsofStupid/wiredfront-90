import { supabase } from "@/integrations/supabase/client";
class Logger {
    constructor() {
        Object.defineProperty(this, "defaultSource", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'system'
        });
    }
    /**
     * Logs an informational message
     */
    async info(message, options) {
        return this.log('info', message, options);
    }
    /**
     * Logs a warning message
     */
    async warn(message, options) {
        return this.log('warn', message, options);
    }
    /**
     * Logs an error message
     */
    async error(message, options) {
        return this.log('error', message, options);
    }
    /**
     * Logs a debug message (only recorded in development environment or when debug mode is enabled)
     */
    async debug(message, options) {
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
    async log(level, message, options) {
        const source = options?.source || this.defaultSource;
        const metadata = options?.metadata || {};
        const userId = options?.userId || await this.getCurrentUserId();
        // Always log to console
        this.logToConsole(level, message, source, metadata);
        // Try to log to database
        try {
            // Use type assertion for system_logs table
            const { error } = await supabase
                .from('system_logs')
                .insert({
                level,
                source,
                message,
                metadata,
                user_id: userId
            });
            if (error) {
                console.error('Failed to write log to database:', error);
            }
        }
        catch (err) {
            console.error('Error logging to database:', err);
        }
    }
    /**
     * Logs a message to the console with appropriate formatting
     */
    logToConsole(level, message, source, metadata) {
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
    async getCurrentUserId() {
        try {
            const { data } = await supabase.auth.getSession();
            return data?.session?.user?.id || null;
        }
        catch {
            return null;
        }
    }
}
export const logger = new Logger();
