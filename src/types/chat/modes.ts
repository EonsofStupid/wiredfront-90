
/**
 * Mode-specific type definitions for the chat system
 */

// Chat modes
export type ChatMode = 'chat' | 'code' | 'assistant';

// Default Chat modes array for validation
export const CHAT_MODES: ChatMode[] = ['chat', 'code', 'assistant'];

/**
 * Type guard to check if a value is a valid ChatMode
 */
export function isChatMode(value: unknown): value is ChatMode {
  return typeof value === 'string' && CHAT_MODES.includes(value as ChatMode);
}

/**
 * Normalize a potentially invalid chat mode to a valid one
 */
export function normalizeChatMode(mode: unknown): ChatMode {
  if (isChatMode(mode)) {
    return mode;
  }
  return 'chat'; // Default fallback
}

// Mode labels for UI display
export const MODE_LABELS: Record<ChatMode, string> = {
  'chat': 'Chat',
  'code': 'Code Assistant',
  'assistant': 'Assistant'
};

// Mode descriptions for tooltips/documentation
export const MODE_DESCRIPTIONS: Record<ChatMode, string> = {
  'chat': 'General chat mode',
  'code': 'Code assistance mode',
  'assistant': 'AI assistant mode'
};
