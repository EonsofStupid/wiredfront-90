
import {
  ChatMode,
  MessageType,
  MessageStatus,
  MessageRole,
  ChatPosition,
  TokenEnforcementMode,
  UIEnforcementMode
} from '@/types/chat/enums';

/**
 * Map MessageType enum to string representation for database storage
 */
export function messageTypeToString(type: MessageType): string {
  switch (type) {
    case MessageType.Text:
      return 'text';
    case MessageType.Command:
      return 'command';
    case MessageType.System:
      return 'system';
    case MessageType.Image:
      return 'image';
    case MessageType.Training:
      return 'training';
    case MessageType.Code:
      return 'code';
    case MessageType.File:
      return 'file';
    default:
      return 'text';
  }
}

/**
 * Map string representation to MessageType enum
 */
export function stringToMessageType(type: string): MessageType {
  switch (type) {
    case 'text':
      return MessageType.Text;
    case 'command':
      return MessageType.Command;
    case 'system':
      return MessageType.System;
    case 'image':
      return MessageType.Image;
    case 'training':
      return MessageType.Training;
    case 'code':
      return MessageType.Code;
    case 'file':
      return MessageType.File;
    default:
      return MessageType.Text;
  }
}

/**
 * Map ChatMode enum to string representation
 */
export function chatModeToString(mode: ChatMode): string {
  switch (mode) {
    case ChatMode.Chat:
      return 'chat';
    case ChatMode.Dev:
      return 'dev';
    case ChatMode.Image:
      return 'image';
    case ChatMode.Training:
      return 'training';
    case ChatMode.Editor:
      return 'editor';
    default:
      return 'chat';
  }
}

/**
 * Map string representation to ChatMode enum
 */
export function stringToChatMode(mode: string): ChatMode {
  switch (mode) {
    case 'chat':
      return ChatMode.Chat;
    case 'dev':
      return ChatMode.Dev;
    case 'image':
      return ChatMode.Image;
    case 'training':
      return ChatMode.Training;
    case 'editor':
      return ChatMode.Editor;
    default:
      return ChatMode.Chat;
  }
}

/**
 * Convert ChatMode to database mode string format (for backward compatibility)
 */
export function chatModeForDatabase(mode: ChatMode | string): string {
  if (typeof mode === 'string') {
    return mode;
  }
  return chatModeToString(mode);
}

/**
 * Convert database mode string to ChatMode (for backward compatibility)
 */
export function databaseToChatMode(mode: string): ChatMode {
  return stringToChatMode(mode);
}

/**
 * Map MessageStatus enum to string representation
 */
export function messageStatusToString(status: MessageStatus): string {
  switch (status) {
    case MessageStatus.Pending:
      return 'pending';
    case MessageStatus.Sent:
      return 'sent';
    case MessageStatus.Received:
      return 'received';
    case MessageStatus.Error:
      return 'error';
    case MessageStatus.Failed:
      return 'failed';
    case MessageStatus.Retrying:
      return 'retrying';
    case MessageStatus.Cached:
      return 'cached';
    default:
      return 'sent';
  }
}

/**
 * Map string representation to MessageStatus enum
 */
export function stringToMessageStatus(status: string): MessageStatus {
  switch (status) {
    case 'pending':
      return MessageStatus.Pending;
    case 'sent':
      return MessageStatus.Sent;
    case 'received':
      return MessageStatus.Received;
    case 'error':
      return MessageStatus.Error;
    case 'failed':
      return MessageStatus.Failed;
    case 'retrying':
      return MessageStatus.Retrying;
    case 'cached':
      return MessageStatus.Cached;
    default:
      return MessageStatus.Sent;
  }
}

/**
 * Map TokenEnforcementMode enum to string representation
 */
export function tokenEnforcementModeToString(mode: TokenEnforcementMode): string {
  switch (mode) {
    case TokenEnforcementMode.Always:
      return 'always';
    case TokenEnforcementMode.Never:
      return 'never';
    case TokenEnforcementMode.RoleBased:
      return 'role_based';
    case TokenEnforcementMode.ModeBased:
      return 'mode_based';
    case TokenEnforcementMode.Warn:
      return 'warn';
    case TokenEnforcementMode.Strict:
      return 'strict';
    default:
      return 'never';
  }
}

/**
 * Map string representation to TokenEnforcementMode enum
 */
export function stringToTokenEnforcementMode(mode: string): TokenEnforcementMode {
  switch (mode) {
    case 'always':
      return TokenEnforcementMode.Always;
    case 'never':
      return TokenEnforcementMode.Never;
    case 'role_based':
      return TokenEnforcementMode.RoleBased;
    case 'mode_based':
      return TokenEnforcementMode.ModeBased;
    case 'warn':
      return TokenEnforcementMode.Warn;
    case 'strict':
      return TokenEnforcementMode.Strict;
    default:
      return TokenEnforcementMode.Never;
  }
}

/**
 * Convert UIEnforcementMode to string
 */
export function tokenToUIEnforcementMode(mode: TokenEnforcementMode): string {
  switch (mode) {
    case TokenEnforcementMode.Always:
      return 'Always On';
    case TokenEnforcementMode.Never:
      return 'Always Off';
    case TokenEnforcementMode.RoleBased:
      return 'Role Based';
    case TokenEnforcementMode.ModeBased:
      return 'Mode Based';
    case TokenEnforcementMode.Warn:
      return 'Warn Only';
    case TokenEnforcementMode.Strict:
      return 'Strict';
    default:
      return 'Not Set';
  }
}
