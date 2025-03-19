
/**
 * Chat mode types - single source of truth
 */

// Core chat mode type - these must match the database enum
export type ChatMode = 
  | 'chat'     // Standard chat mode
  | 'dev'      // Developer assistance mode
  | 'image'    // Image generation mode
  | 'training' // Training/educational mode
  | 'code'     // Code-specific assistance
  | 'planning'; // Planning/architectural mode

// Constants for chat modes (matching database)
export const CHAT_MODES = {
  CHAT: 'chat',
  DEV: 'dev',
  IMAGE: 'image',
  TRAINING: 'training',
  CODE: 'code',
  PLANNING: 'planning'
} as const;

/**
 * Type guard for chat modes
 */
export function isChatMode(value: unknown): value is ChatMode {
  return typeof value === 'string' && [
    'chat',
    'dev',
    'image',
    'training',
    'code',
    'planning'
  ].includes(value as string);
}

/**
 * Normalize legacy mode names to current ones
 */
export function normalizeChatMode(mode: string | null | undefined): ChatMode {
  if (!mode) return 'chat';
  
  // Map legacy values to new expected values
  const modeMap: Record<string, ChatMode> = {
    'standard': 'chat',
    'developer': 'dev'
  };
  
  // If it's a valid mode, return it or its mapped value
  const normalizedMode = modeMap[mode as string] || mode;
  if (isChatMode(normalizedMode)) {
    return normalizedMode;
  }
  
  // Default fallback
  return 'chat';
}
