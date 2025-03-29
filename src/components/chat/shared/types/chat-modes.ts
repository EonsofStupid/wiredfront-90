
import { ChatMode } from '@/types/chat/enums';

/**
 * Convert a ChatMode enum to a database string representation
 */
export function chatModeForDatabase(mode: ChatMode): string {
  return mode.toString().toLowerCase();
}

/**
 * Convert a database string to a ChatMode enum value
 */
export function databaseStringToChatMode(mode: string): ChatMode {
  const normalizedMode = mode.toLowerCase().trim();
  
  switch (normalizedMode) {
    case 'chat':
      return ChatMode.Chat;
    case 'dev':
    case 'editor':
    case 'development':
      return ChatMode.Dev;
    case 'image':
      return ChatMode.Image;
    case 'training':
      return ChatMode.Training;
    case 'planning':
      return ChatMode.Planning;
    case 'code':
      return ChatMode.Code;
    default:
      return ChatMode.Chat;
  }
}

/**
 * Get label for chat mode (for display in UI)
 */
export function getChatModeLabel(mode: ChatMode): string {
  switch (mode) {
    case ChatMode.Chat:
      return 'Chat';
    case ChatMode.Dev:
    case ChatMode.Editor:
      return 'Developer';
    case ChatMode.Image:
      return 'Image';
    case ChatMode.Training:
      return 'Training';
    case ChatMode.Planning:
      return 'Planning';
    case ChatMode.Code:
      return 'Code';
    default:
      return 'Chat';
  }
}

/**
 * Get icon name for chat mode
 */
export function getChatModeIcon(mode: ChatMode): string {
  switch (mode) {
    case ChatMode.Chat:
      return 'message-circle';
    case ChatMode.Dev:
    case ChatMode.Editor:
      return 'code';
    case ChatMode.Image:
      return 'image';
    case ChatMode.Training:
      return 'graduation-cap';
    case ChatMode.Planning:
      return 'clipboard-list';
    case ChatMode.Code:
      return 'terminal';
    default:
      return 'message-circle';
  }
}
