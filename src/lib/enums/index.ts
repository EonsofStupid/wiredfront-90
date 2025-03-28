
/**
 * Utilities for working with enums throughout the application
 */
import { 
  ChatMode, 
  MessageRole, 
  MessageStatus, 
  MessageType, 
  databaseModeToUiMode, 
  uiModeToDatabaseMode,
  ChatPosition,
  UIEnforcementMode,
  TokenEnforcementMode
} from '@/types/chat/enums';

/**
 * Convert a string to the corresponding MessageType enum
 */
export const stringToMessageType = (type: string): MessageType => {
  switch (type?.toLowerCase()) {
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
};

/**
 * Convert a MessageType enum to its string representation
 */
export const messageTypeToString = (type: MessageType): string => {
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
};

/**
 * Convert a string to the corresponding MessageRole enum
 */
export const stringToMessageRole = (role: string): MessageRole => {
  switch (role?.toLowerCase()) {
    case 'user':
      return MessageRole.User;
    case 'assistant':
      return MessageRole.Assistant;
    case 'system':
      return MessageRole.System;
    default:
      return MessageRole.User;
  }
};

/**
 * Convert a MessageRole enum to its string representation
 */
export const messageRoleToString = (role: MessageRole): string => {
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
};

/**
 * Convert a string to the corresponding MessageStatus enum
 */
export const stringToMessageStatus = (status: string): MessageStatus => {
  switch (status?.toLowerCase()) {
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
      return MessageStatus.Pending;
  }
};

/**
 * Convert a MessageStatus enum to its string representation
 */
export const messageStatusToString = (status: MessageStatus): string => {
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
      return 'pending';
  }
};

/**
 * Convert a string to the corresponding ChatMode enum
 */
export const stringToChatMode = (mode: string): ChatMode => {
  switch (mode?.toLowerCase()) {
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
};

/**
 * Convert a ChatMode enum to its string representation
 */
export const chatModeToString = (mode: ChatMode): string => {
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
};

/**
 * Convert a string to ChatPosition enum
 */
export const stringToChatPosition = (position: string): ChatPosition => {
  switch (position?.toLowerCase()) {
    case 'bottom-right':
      return ChatPosition.BottomRight;
    case 'bottom-left':
      return ChatPosition.BottomLeft;
    case 'custom':
      return ChatPosition.Custom;
    default:
      return ChatPosition.BottomRight;
  }
};

/**
 * Convert a ChatPosition enum to string
 */
export const chatPositionToString = (position: ChatPosition): string => {
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
};

/**
 * Convert a UI mode string to database ChatMode
 */
export const uiModeToChatMode = (uiMode: string): ChatMode => {
  return uiMode in uiModeToDatabaseMode 
    ? uiModeToDatabaseMode[uiMode]
    : ChatMode.Chat;
};

/**
 * Convert a database ChatMode to UI mode string
 */
export const chatModeToUiMode = (dbMode: ChatMode): string => {
  return dbMode in databaseModeToUiMode
    ? databaseModeToUiMode[dbMode]
    : 'standard';
};

/**
 * Validate and return a properly formatted ChatMode for database operations
 */
export const chatModeForDatabase = (mode: ChatMode | string): string => {
  if (typeof mode === 'string') {
    return chatModeToString(stringToChatMode(mode));
  }
  return chatModeToString(mode);
};

/**
 * General enum validation function
 */
export const validate = (enumName: string, value: string): string => {
  switch (enumName) {
    case 'ChatMode':
      return chatModeToString(stringToChatMode(value));
    case 'MessageRole':
      return messageRoleToString(stringToMessageRole(value));
    case 'MessageType':
      return messageTypeToString(stringToMessageType(value));
    case 'MessageStatus':
      return messageStatusToString(stringToMessageStatus(value));
    default:
      return value;
  }
};

/**
 * Safely parse a value into an enum with a fallback
 */
export const safeParse = (enumName: string, value: string, fallback: string): string => {
  try {
    return validate(enumName, value);
  } catch (e) {
    return fallback;
  }
};

/**
 * Flexibly parse a string to an enum value, removing whitespace and case sensitivity
 */
export const flexibleParse = (enumName: string, value: string): string => {
  const cleanValue = value.trim().toLowerCase();
  return validate(enumName, cleanValue);
};

/**
 * Get all values for an enum
 */
export const values = (enumName: string): string[] => {
  switch (enumName) {
    case 'ChatMode':
      return Object.values(ChatMode);
    case 'MessageRole':
      return Object.values(MessageRole);
    case 'MessageType':
      return Object.values(MessageType);
    case 'MessageStatus':
      return Object.values(MessageStatus);
    case 'ChatPosition':
      return Object.values(ChatPosition);
    case 'UIEnforcementMode':
      return Object.values(UIEnforcementMode);
    case 'TokenEnforcementMode':
      return Object.values(TokenEnforcementMode);
    default:
      return [];
  }
};

/**
 * Generate metadata for an enum (useful for UI components)
 */
export const meta = (enumName: string): { value: string; label: string }[] => {
  const vals = values(enumName);
  return vals.map(value => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1)
  }));
};

// Export a complete EnumUtils object for easy imports
export const EnumUtils = {
  stringToMessageType,
  messageTypeToString,
  stringToMessageRole,
  messageRoleToString,
  stringToMessageStatus,
  messageStatusToString,
  stringToChatMode,
  chatModeToString,
  stringToChatPosition,
  chatPositionToString,
  uiModeToChatMode,
  chatModeToUiMode,
  chatModeForDatabase,
  validate,
  safeParse,
  flexibleParse,
  values,
  meta
};
