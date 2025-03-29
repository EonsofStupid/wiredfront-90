
import { 
  MessageType, 
  MessageRole, 
  MessageStatus, 
  ChatMode, 
  ChatPosition,
  TokenEnforcementMode
} from '@/types/chat/enums';

export type UiChatMode = 'standard' | 'editor' | 'image' | 'training' | 'planning' | 'code' | 'document' | 'audio';

/**
 * Utility methods for handling enums in the application
 */
export const EnumUtils = {
  /**
   * Convert a string to a ChatMode enum value
   */
  stringToChatMode: (mode: string): ChatMode => {
    switch (mode?.toLowerCase()) {
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
   * Convert a ChatMode enum value to a string
   */
  chatModeToString: (mode: ChatMode): string => {
    return mode.toString();
  },

  /**
   * Convert a ChatMode enum value to a UI mode
   */
  chatModeToUiMode: (mode: ChatMode): UiChatMode => {
    switch (mode) {
      case ChatMode.Chat: return 'standard';
      case ChatMode.Dev:
      case ChatMode.Editor: return 'editor';
      case ChatMode.Image: return 'image';
      case ChatMode.Training: return 'training';
      case ChatMode.Planning: return 'planning';
      case ChatMode.Code: return 'code';
      case ChatMode.Document: return 'document';
      case ChatMode.Audio: return 'audio';
      default: return 'standard';
    }
  },

  /**
   * Convert a UI mode to a ChatMode enum value
   */
  uiModeToChatMode: (mode: UiChatMode): ChatMode => {
    switch (mode) {
      case 'standard': return ChatMode.Chat;
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
   * Convert a string to a ChatPosition enum value
   */
  stringToChatPosition: (position: string): ChatPosition => {
    switch (position?.toLowerCase()) {
      case 'bottom-right': return ChatPosition.BottomRight;
      case 'bottom-left': return ChatPosition.BottomLeft;
      case 'top-right': return ChatPosition.TopRight;
      case 'top-left': return ChatPosition.TopLeft;
      default: return ChatPosition.BottomRight;
    }
  },

  /**
   * Convert a string to a MessageRole enum value
   */
  stringToMessageRole: (role: string): MessageRole => {
    switch (role?.toLowerCase()) {
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
   * Convert a MessageRole enum value to a display label
   */
  getMessageRoleLabel: (role: MessageRole): string => {
    switch (role) {
      case MessageRole.User: return 'You';
      case MessageRole.Assistant: return 'Assistant';
      case MessageRole.System: return 'System';
      case MessageRole.Error: return 'Error';
      case MessageRole.Tool: return 'Tool';
      case MessageRole.Function: return 'Function';
      default: return 'Unknown';
    }
  },

  /**
   * Convert a string to a MessageType enum value
   */
  stringToMessageType: (type: string): MessageType => {
    switch (type?.toLowerCase()) {
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
   * Convert a MessageType enum value to a string
   */
  messageTypeToString: (type: MessageType): string => {
    return type.toString();
  },

  /**
   * Get a display label for a MessageType
   */
  getMessageTypeLabel: (type: MessageType): string => {
    switch (type) {
      case MessageType.Text: return 'Text';
      case MessageType.Command: return 'Command';
      case MessageType.System: return 'System';
      case MessageType.Image: return 'Image';
      case MessageType.Training: return 'Training';
      case MessageType.Code: return 'Code';
      case MessageType.File: return 'File';
      case MessageType.Audio: return 'Audio';
      case MessageType.Link: return 'Link';
      case MessageType.Document: return 'Document';
      default: return 'Unknown';
    }
  },

  /**
   * Convert a string to a MessageStatus enum value
   */
  stringToMessageStatus: (status: string): MessageStatus => {
    switch (status?.toLowerCase()) {
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
   * Convert a string to a TokenEnforcementMode enum value
   */
  stringToTokenEnforcementMode: (mode: string): TokenEnforcementMode => {
    switch (mode?.toLowerCase()) {
      case 'none': return TokenEnforcementMode.None;
      case 'warn': return TokenEnforcementMode.Warn;
      case 'soft': return TokenEnforcementMode.Soft;
      case 'hard': return TokenEnforcementMode.Hard;
      case 'always': return TokenEnforcementMode.Always;
      case 'never': return TokenEnforcementMode.Never;
      case 'role_based': return TokenEnforcementMode.RoleBased;
      case 'mode_based': return TokenEnforcementMode.ModeBased;
      case 'strict': return TokenEnforcementMode.Strict;
      default: return TokenEnforcementMode.None;
    }
  }
};

export default EnumUtils;
