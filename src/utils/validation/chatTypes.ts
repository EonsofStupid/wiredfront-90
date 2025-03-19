
import { z } from 'zod';
import { ChatMode, isChatMode, MessageRole, MessageStatus } from '@/types/chat';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';

// Chat mode validation schema
export const chatModeSchema = z.custom<ChatMode>(
  (val) => isChatMode(val),
  { message: "Invalid chat mode" }
);

// Message role validation schema
export const messageRoleSchema = z.enum(['user', 'assistant', 'system'] as [MessageRole, ...MessageRole[]]);

// Message status validation schema
export const messageStatusSchema = z.enum([
  'pending', 'sent', 'delivered', 'read', 'error'
] as [MessageStatus, ...MessageStatus[]]);

// Error types for validation failures
export type ChatTypeError = {
  code: 'INVALID_MODE' | 'INVALID_ROLE' | 'INVALID_STATUS' | 'CONVERSION_ERROR';
  message: string;
  originalValue?: unknown;
};

/**
 * Validates a chat mode value
 * @param value The value to validate
 * @param options Optional configuration
 * @returns The validated ChatMode or an error object
 */
export const validateChatMode = (
  value: unknown, 
  options: { silent?: boolean; fallback?: ChatMode } = {}
): ChatMode => {
  try {
    return chatModeSchema.parse(value);
  } catch (error) {
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
export const toChatMode = (value: unknown): ChatMode => {
  // Handle null/undefined
  if (value == null) return 'chat';
  
  // If it's already a valid mode, return it
  if (isChatMode(value)) return value;
  
  // Handle string conversions
  if (typeof value === 'string') {
    // Map legacy values
    const modeMap: Record<string, ChatMode> = {
      'standard': 'chat',
      'developer': 'dev'
    };
    
    const normalized = modeMap[value] || value;
    if (isChatMode(normalized)) return normalized;
  }
  
  // Default fallback
  return 'chat';
};
