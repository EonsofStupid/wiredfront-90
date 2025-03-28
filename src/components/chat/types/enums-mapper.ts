
import { ChatMode, MessageRole, MessageStatus, MessageType } from '@/types/chat/enums';

/**
 * Convert ChatMode enum to database string representation
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
    case ChatMode.Planning:
      return 'planning';
    case ChatMode.Code:
      return 'code';
    default:
      return 'chat';
  }
}

/**
 * Convert database string representation to ChatMode enum
 */
export function stringToChatMode(modeString: string): ChatMode {
  switch (modeString.toLowerCase()) {
    case 'chat':
      return ChatMode.Chat;
    case 'dev':
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
 * Convert MessageType enum to string representation
 */
export function messageTypeToString(type: MessageType): string {
  switch (type) {
    case MessageType.Text:
      return 'text';
    case MessageType.Image:
      return 'image';
    case MessageType.Code:
      return 'code';
    case MessageType.File:
      return 'file';
    case MessageType.System:
      return 'system';
    default:
      return 'text';
  }
}

/**
 * Convert string representation to MessageType enum
 */
export function stringToMessageType(typeString: string): MessageType {
  switch (typeString.toLowerCase()) {
    case 'text':
      return MessageType.Text;
    case 'image':
      return MessageType.Image;
    case 'code':
      return MessageType.Code;
    case 'file':
      return MessageType.File;
    case 'system':
      return MessageType.System;
    default:
      return MessageType.Text;
  }
}

/**
 * Convert MessageRole enum to string representation
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
 * Convert string representation to MessageRole enum
 */
export function stringToMessageRole(roleString: string): MessageRole {
  switch (roleString.toLowerCase()) {
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
 * Convert MessageStatus enum to string representation 
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
    case MessageStatus.Delivered:
      return 'delivered';
    default:
      return 'pending';
  }
}

/**
 * Convert string representation to MessageStatus enum
 */
export function stringToMessageStatus(statusString: string): MessageStatus {
  switch (statusString.toLowerCase()) {
    case 'pending':
      return MessageStatus.Pending;
    case 'sent':
      return MessageStatus.Sent;
    case 'received':
      return MessageStatus.Received;
    case 'error':
      return MessageStatus.Error;
    case 'delivered':
      return MessageStatus.Delivered;
    default:
      return MessageStatus.Pending;
  }
}
