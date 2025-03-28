
/**
 * Utilities for working with enums throughout the application
 */
import { 
  ChatMode, 
  MessageRole, 
  MessageStatus, 
  MessageType, 
  databaseModeToUiMode, 
  uiModeToDatabaseMode 
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
};
