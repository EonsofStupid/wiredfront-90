
import { ChatMode, MessageRole, MessageType } from '@/types/chat/enums';
import { UiChatMode } from '../store/types/chat-store-types';

/**
 * Convert a UI-friendly chat mode to a database-friendly mode
 */
export function uiModeToChatMode(uiMode: string): ChatMode {
  switch (uiMode) {
    case 'standard':
      return ChatMode.Chat;
    case 'editor':
      return ChatMode.Dev;
    case 'image':
      return ChatMode.Image;
    case 'training':
      return ChatMode.Training;
    case 'planning':
      return ChatMode.Planning;
    case 'code':
      return ChatMode.Code;
    case 'document':
      return ChatMode.Document;
    case 'audio':
      return ChatMode.Audio;
    default:
      return ChatMode.Chat;
  }
}

/**
 * Convert a database chat mode to a UI-friendly mode
 */
export function chatModeToUiMode(mode: ChatMode): UiChatMode {
  switch (mode) {
    case ChatMode.Chat:
      return 'standard';
    case ChatMode.Dev:
    case ChatMode.Editor:
      return 'editor';
    case ChatMode.Image:
      return 'image';
    case ChatMode.Training:
      return 'training';
    case ChatMode.Planning:
      return 'planning';
    case ChatMode.Code:
      return 'code';
    case ChatMode.Document:
      return 'document';
    case ChatMode.Audio:
      return 'audio';
    default:
      return 'standard';
  }
}

/**
 * Convert ChatMode enum to icon name
 */
export function chatModeToIcon(mode: ChatMode): string {
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
    case ChatMode.Document:
      return 'file-text';
    case ChatMode.Audio:
      return 'headphones';
    default:
      return 'message-circle';
  }
}

/**
 * Convert database string to ChatMode enum
 */
export function databaseStringToChatMode(mode: string): ChatMode {
  switch (mode.toLowerCase()) {
    case 'chat':
      return ChatMode.Chat;
    case 'dev':
    case 'editor':
      return ChatMode.Dev;
    case 'image':
      return ChatMode.Image;
    case 'training':
      return ChatMode.Training;
    case 'planning':
      return ChatMode.Planning;
    case 'code':
      return ChatMode.Code;
    case 'document':
      return ChatMode.Document;
    case 'audio':
      return ChatMode.Audio;
    default:
      return ChatMode.Chat;
  }
}

/**
 * Convert ChatMode enum to database-friendly string
 */
export function chatModeToString(mode: ChatMode): string {
  switch (mode) {
    case ChatMode.Chat:
      return 'chat';
    case ChatMode.Dev:
    case ChatMode.Editor:
      return 'dev';
    case ChatMode.Image:
      return 'image';
    case ChatMode.Training:
      return 'training';
    case ChatMode.Planning:
      return 'planning';
    case ChatMode.Code:
      return 'code';
    case ChatMode.Document:
      return 'document';
    case ChatMode.Audio:
      return 'audio';
    default:
      return 'chat';
  }
}

/**
 * Get a friendly label for a message role
 */
export function getRoleLabel(role: MessageRole): string {
  switch (role) {
    case MessageRole.User:
      return 'User';
    case MessageRole.Assistant:
      return 'Assistant';
    case MessageRole.System:
      return 'System';
    case MessageRole.Error:
      return 'Error';
    case MessageRole.Tool:
      return 'Tool';
    case MessageRole.Function:
      return 'Function';
    default:
      return 'Unknown';
  }
}

/**
 * Get a friendly label for a message type
 */
export function getMessageTypeLabel(type: MessageType): string {
  switch (type) {
    case MessageType.Text:
      return 'Text';
    case MessageType.Command:
      return 'Command';
    case MessageType.System:
      return 'System';
    case MessageType.Image:
      return 'Image';
    case MessageType.Training:
      return 'Training';
    case MessageType.Code:
      return 'Code';
    case MessageType.File:
      return 'File';
    case MessageType.Audio:
      return 'Audio';
    case MessageType.Link:
      return 'Link';
    case MessageType.Document:
      return 'Document';
    default:
      return 'Unknown';
  }
}
