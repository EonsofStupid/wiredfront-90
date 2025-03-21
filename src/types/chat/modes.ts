
/**
 * Mode-specific type definitions for the chat system
 */

// Basic chat modes supported by the system
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
  return typeof value === 'string' && Object.values(CHAT_MODES).includes(value as ChatMode);
}

/**
 * Normalize legacy mode names to current ones
 */
export function normalizeChatMode(mode: string | null | undefined): ChatMode {
  if (!mode) return CHAT_MODES.CHAT;
  
  // Map legacy values to new expected values
  const modeMap: Record<string, ChatMode> = {
    'standard': CHAT_MODES.CHAT,
    'developer': CHAT_MODES.DEV,
    'editor': CHAT_MODES.CODE,
    'project': CHAT_MODES.CODE,
    'assistant': CHAT_MODES.CHAT,
    'agent': CHAT_MODES.CHAT,
    'doc': CHAT_MODES.CHAT
  };
  
  // If it's a valid mode, return it or its mapped value
  const normalizedMode = modeMap[mode as string] || mode;
  if (isChatMode(normalizedMode)) {
    return normalizedMode;
  }
  
  // Default fallback
  return CHAT_MODES.CHAT;
}

/**
 * Map of mode names to display names
 */
export const CHAT_MODE_DISPLAY_NAMES: Record<ChatMode, string> = {
  'chat': 'Chat',
  'dev': 'Developer',
  'image': 'Image',
  'training': 'Training',
  'code': 'Code',
  'planning': 'Planning'
};

/**
 * Map of modes to descriptions
 */
export const CHAT_MODE_DESCRIPTIONS: Record<ChatMode, string> = {
  'chat': 'General assistance and conversation',
  'dev': 'Development and programming help',
  'image': 'Generate and edit images',
  'training': 'Educational content and tutorials',
  'code': 'Code-specific assistance and reviews',
  'planning': 'Project planning and architecture'
};
