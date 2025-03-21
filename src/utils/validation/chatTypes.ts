
import { ChatMode, isChatMode } from '@/types/chat/core';

interface ValidateChatModeOptions {
  silent?: boolean;
  fallback?: ChatMode;
}

/**
 * Validates that a value is a valid chat mode and normalizes it
 */
export function validateChatMode(
  value: unknown, 
  options: ValidateChatModeOptions = {}
): ChatMode {
  const { silent = false, fallback = 'chat' } = options;
  
  if (isChatMode(value)) {
    return value;
  }
  
  if (!silent) {
    console.warn(`Invalid chat mode: ${value}, falling back to ${fallback}`);
  }
  
  return fallback;
}

/**
 * Validates that a string is a valid session ID format
 */
export function validateSessionId(id: string): boolean {
  // Check for UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
