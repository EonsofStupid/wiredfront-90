import { z } from 'zod';
import { isChatMode } from '@/types/chat';
import { logger } from '@/services/chat/LoggingService';
// Chat mode validation schema
export const chatModeSchema = z.custom((val) => isChatMode(val), { message: "Invalid chat mode" });
// Message role validation schema
export const messageRoleSchema = z.enum(['user', 'assistant', 'system']);
// Message status validation schema - ensure the array matches the type
export const messageStatusSchema = z.enum([
    'pending', 'sent', 'delivered', 'read', 'error', 'failed', 'cached'
]);
/**
 * Validates a chat mode value
 * @param value The value to validate
 * @param options Optional configuration
 * @returns The validated ChatMode or an error object
 */
export const validateChatMode = (value, options = {}) => {
    try {
        return chatModeSchema.parse(value);
    }
    catch (error) {
        const fallback = options.fallback || 'chat';
        if (!options.silent) {
            logger.warn(`Invalid chat mode: ${String(value)}, using fallback: ${fallback}`);
        }
        return fallback;
    }
};
/**
 * Safe function to convert any value to a valid chat mode
 */
export const toChatMode = (value) => {
    // Handle null/undefined
    if (value == null)
        return 'chat';
    // If it's already a valid mode, return it
    if (isChatMode(value))
        return value;
    // Handle string conversions
    if (typeof value === 'string') {
        // Map legacy values
        const modeMap = {
            'standard': 'chat',
            'developer': 'dev'
        };
        const normalized = modeMap[value] || value;
        if (isChatMode(normalized))
            return normalized;
    }
    // Default fallback
    return 'chat';
};
