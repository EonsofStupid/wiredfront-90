
import { 
  ChatMode, 
  MessageRole, 
  MessageStatus, 
  MessageType,
  TaskType,
  TokenEnforcementMode 
} from '@/types/chat/enums';
import { chatModeToDbString, dbStringToChatMode } from '@/types/chat/conversation';

/**
 * Type representing UI-friendly chat modes
 */
export type UiChatMode = 'chat' | 'dev' | 'image' | 'training' | 'code' | 'document';

/**
 * Utility functions for enum handling
 */
export const EnumUtils = {
  /**
   * Convert a string to a ChatMode enum value
   */
  stringToChatMode(mode: string): ChatMode {
    switch (mode.toLowerCase()) {
      case 'chat': return ChatMode.Chat;
      case 'dev': 
      case 'editor': return ChatMode.Dev;
      case 'image': return ChatMode.Image;
      case 'training': return ChatMode.Training;
      case 'planning': return ChatMode.Planning;
      case 'code': return ChatMode.Code;
      case 'document': return ChatMode.Document;
      case 'audio': return ChatMode.Audio;
      default: return ChatMode.Chat;
    }
  },

  /**
   * Convert a ChatMode enum to a string
   */
  chatModeToString(mode: ChatMode): string {
    switch (mode) {
      case ChatMode.Chat: return 'chat';
      case ChatMode.Dev: 
      case ChatMode.Editor: return 'dev';
      case ChatMode.Image: return 'image';
      case ChatMode.Training: return 'training';
      case ChatMode.Planning: return 'planning';
      case ChatMode.Code: return 'code';
      case ChatMode.Document: return 'document';
      case ChatMode.Audio: return 'audio';
      default: return 'chat';
    }
  },

  /**
   * Convert a ChatMode to a UI-friendly mode name
   */
  chatModeToUiMode(mode: ChatMode): UiChatMode {
    switch (mode) {
      case ChatMode.Chat: return 'chat';
      case ChatMode.Dev:
      case ChatMode.Editor: return 'dev';
      case ChatMode.Image: return 'image';
      case ChatMode.Training: return 'training';
      case ChatMode.Code: return 'code';
      case ChatMode.Document: return 'document';
      default: return 'chat';
    }
  },

  /**
   * Convert a MessageRole enum to a string
   */
  messageRoleToString(role: MessageRole): string {
    return role.toString();
  },

  /**
   * Convert a string to a MessageRole enum value
   */
  stringToMessageRole(role: string): MessageRole {
    switch (role.toLowerCase()) {
      case 'user': return MessageRole.User;
      case 'assistant': return MessageRole.Assistant;
      case 'system': return MessageRole.System;
      case 'error': return MessageRole.Error;
      case 'tool': return MessageRole.Tool;
      case 'function': return MessageRole.Function;
      default: return MessageRole.User;
    }
  },

  /**
   * Convert a MessageType enum to a string
   */
  messageTypeToString(type: MessageType): string {
    return type.toString();
  },

  /**
   * Convert a string to a MessageType enum value
   */
  stringToMessageType(type: string): MessageType {
    switch (type.toLowerCase()) {
      case 'text': return MessageType.Text;
      case 'command': return MessageType.Command;
      case 'system': return MessageType.System;
      case 'image': return MessageType.Image;
      case 'training': return MessageType.Training;
      case 'code': return MessageType.Code;
      case 'file': return MessageType.File;
      case 'audio': return MessageType.Audio;
      case 'link': return MessageType.Link;
      case 'document': return MessageType.Document;
      default: return MessageType.Text;
    }
  },

  /**
   * Convert a MessageStatus enum to a string
   */
  messageStatusToString(status: MessageStatus): string {
    return status.toString();
  },

  /**
   * Convert a string to a MessageStatus enum value
   */
  stringToMessageStatus(status: string): MessageStatus {
    switch (status.toLowerCase()) {
      case 'pending': return MessageStatus.Pending;
      case 'sending': return MessageStatus.Sending;
      case 'sent': return MessageStatus.Sent;
      case 'received': return MessageStatus.Received;
      case 'error': return MessageStatus.Error;
      case 'failed': return MessageStatus.Failed;
      case 'retrying': return MessageStatus.Retrying;
      case 'cached': return MessageStatus.Cached;
      case 'canceled': return MessageStatus.Canceled;
      case 'delivered': return MessageStatus.Delivered;
      default: return MessageStatus.Pending;
    }
  },

  /**
   * Convert a chatmode to database string format
   */
  chatModeForDatabase(mode: ChatMode): string {
    return chatModeToDbString(mode);
  },

  /**
   * Convert database string to ChatMode enum
   */
  databaseStringToChatMode(mode: string): ChatMode {
    return dbStringToChatMode(mode);
  },

  /**
   * Convert a string to a TokenEnforcementMode enum value
   */
  stringToTokenEnforcementMode(mode: string): TokenEnforcementMode {
    switch (mode.toLowerCase()) {
      case 'none': return TokenEnforcementMode.None;
      case 'warn': return TokenEnforcementMode.Warn;
      case 'soft': return TokenEnforcementMode.Soft;
      case 'hard': return TokenEnforcementMode.Hard;
      case 'always': return TokenEnforcementMode.Always;
      case 'never': return TokenEnforcementMode.Never;
      case 'role_based': return TokenEnforcementMode.RoleBased;
      case 'mode_based': return TokenEnforcementMode.ModeBased;
      case 'strict': return TokenEnforcementMode.Strict;
      default: return TokenEnforcementMode.Warn;
    }
  },

  /**
   * Get a user-friendly label for a ChatMode
   */
  getChatModeLabel(mode: ChatMode): string {
    switch (mode) {
      case ChatMode.Chat: return 'Chat';
      case ChatMode.Dev: return 'Development';
      case ChatMode.Editor: return 'Editor';
      case ChatMode.Image: return 'Image Generation';
      case ChatMode.Training: return 'Training';
      case ChatMode.Planning: return 'Planning';
      case ChatMode.Code: return 'Code Assistant';
      case ChatMode.Document: return 'Document';
      case ChatMode.Audio: return 'Audio';
      default: return 'Chat';
    }
  }
};
