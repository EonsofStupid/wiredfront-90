
import { ChatMode, ChatPosition } from '@/types/chat/enums';

/**
 * Maps UI display modes to database chat modes
 * This is used when we need to convert from a display string to a database enum value
 */
export const uiModeToDatabaseMode: Record<string, ChatMode> = {
  'standard': ChatMode.Chat,
  'editor': ChatMode.Dev,
  'image': ChatMode.Image,
  'training': ChatMode.Training,
};

/**
 * Maps database chat modes to UI display modes
 * This is used when we need to convert from a database enum value to a display string
 */
export const databaseModeToUiMode: Record<ChatMode, string> = {
  [ChatMode.Chat]: 'standard',
  [ChatMode.Dev]: 'editor',
  [ChatMode.Editor]: 'editor', // Support both 'Dev' and 'Editor' for consistency
  [ChatMode.Image]: 'image',
  [ChatMode.Training]: 'training',
};

/**
 * Type for UI mode strings
 */
export type UiChatMode = 'standard' | 'editor' | 'image' | 'training';

/**
 * Check if a string is a valid UI mode
 */
export function isValidUiMode(mode: string): mode is UiChatMode {
  return Object.keys(uiModeToDatabaseMode).includes(mode);
}

/**
 * Convert a UI mode string to a database ChatMode enum
 */
export function convertUiModeToDbMode(uiMode: string): ChatMode {
  if (isValidUiMode(uiMode)) {
    return uiModeToDatabaseMode[uiMode];
  }
  // Default to Chat mode if invalid
  return ChatMode.Chat;
}

/**
 * Convert a database ChatMode enum to a UI mode string
 */
export function convertDbModeToUiMode(dbMode: ChatMode): UiChatMode {
  return databaseModeToUiMode[dbMode] as UiChatMode || 'standard';
}

// For ChatPosition, we'll use the enum directly from the central types
export type ChatPositionType = ChatPosition;
