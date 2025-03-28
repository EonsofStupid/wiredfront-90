
import { 
  ChatMode, 
  MessageType,
  TokenEnforcementMode,
  UIEnforcementMode,
  MessageRole,
  MessageStatus,
  ChatPosition
} from '@/types/chat/enums';

/**
 * Maps string literals to ChatMode enum values
 */
export function stringToChatMode(mode: string): ChatMode {
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
    default:
      return ChatMode.Chat;
  }
}

/**
 * Maps ChatMode enum values to string literals
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
    default:
      return 'chat';
  }
}

/**
 * Helper function for converting chat mode to database format
 */
export function chatModeForDatabase(mode: string | ChatMode): ChatMode {
  if (typeof mode === 'string') {
    return stringToChatMode(mode);
  }
  return mode;
}

/**
 * Maps string literals to MessageType enum values
 */
export function stringToMessageType(type: string): MessageType {
  switch (type.toLowerCase()) {
    case 'text':
      return MessageType.Text;
    case 'command':
      return MessageType.Command;
    case 'system':
      return MessageType.System;
    case 'image':
      return MessageType.Image;
    case 'file':
      return MessageType.File;
    case 'training':
      return MessageType.Training;
    case 'code':
      return MessageType.Code;
    default:
      return MessageType.Text;
  }
}

/**
 * Maps MessageType enum values to string literals
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
    case MessageType.File:
      return 'file';
    case MessageType.Training:
      return 'training';
    case MessageType.Code:
      return 'code';
    default:
      return 'text';
  }
}

/**
 * Maps string literals to MessageRole enum values
 */
export function stringToMessageRole(role: string): MessageRole {
  switch (role.toLowerCase()) {
    case 'user':
      return MessageRole.User;
    case 'assistant':
      return MessageRole.Assistant;
    case 'system':
      return MessageRole.System;
    default:
      return MessageRole.User;
  }
}

/**
 * Maps MessageRole enum values to string literals
 */
export function messageRoleToString(role: MessageRole): string {
  switch (role) {
    case MessageRole.User:
      return 'user';
    case MessageRole.Assistant:
      return 'assistant';
    case MessageRole.System:
      return 'system';
    default:
      return 'user';
  }
}

/**
 * Maps string literals to MessageStatus enum values
 */
export function stringToMessageStatus(status: string): MessageStatus {
  switch (status.toLowerCase()) {
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
 * Maps MessageStatus enum values to string literals
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
 * Maps between UI enforcement modes and database enforcement modes
 */
export function uiToDbEnforcementMode(uiMode: UIEnforcementMode): TokenEnforcementMode {
  switch (uiMode) {
    case UIEnforcementMode.Always:
      return TokenEnforcementMode.Always;
    case UIEnforcementMode.Never:
      return TokenEnforcementMode.Never;
    case UIEnforcementMode.Soft:
      return TokenEnforcementMode.Warn;
    default:
      return TokenEnforcementMode.Warn;
  }
}

/**
 * Maps between database enforcement modes and UI enforcement modes
 */
export function dbToUiEnforcementMode(dbMode: TokenEnforcementMode): UIEnforcementMode {
  switch (dbMode) {
    case TokenEnforcementMode.Always:
      return UIEnforcementMode.Always;
    case TokenEnforcementMode.Never:
      return UIEnforcementMode.Never;
    case TokenEnforcementMode.RoleBased:
    case TokenEnforcementMode.ModeBased:
    case TokenEnforcementMode.Warn:
      return UIEnforcementMode.Soft;
    case TokenEnforcementMode.Strict:
      return UIEnforcementMode.Always;
    default:
      return UIEnforcementMode.Soft;
  }
}

/**
 * Maps string literals to ChatPosition enum values
 */
export function stringToChatPosition(position: string): ChatPosition {
  switch (position.toLowerCase()) {
    case 'bottom-right':
      return ChatPosition.BottomRight;
    case 'bottom-left':
      return ChatPosition.BottomLeft;
    case 'custom':
      return ChatPosition.Custom;
    default:
      return ChatPosition.BottomRight;
  }
}

/**
 * Maps ChatPosition enum values to string literals
 */
export function chatPositionToString(position: ChatPosition): string {
  switch (position) {
    case ChatPosition.BottomRight:
      return 'bottom-right';
    case ChatPosition.BottomLeft:
      return 'bottom-left';
    case ChatPosition.Custom:
      return 'custom';
    default:
      return 'bottom-right';
  }
}

/**
 * Helper function to safely use enum values in database operations
 */
export function safeEnumValue(value: string | number | symbol): string | number {
  if (typeof value === 'symbol') {
    return value.toString().replace(/^Symbol\((.*)\)$/, '$1');
  }
  return value;
}
