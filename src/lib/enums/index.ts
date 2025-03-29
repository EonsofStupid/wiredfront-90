
import { ChatMode, ChatPosition, TokenEnforcementMode, MessageRole, MessageStatus, MessageType, TaskType } from '@/types/chat/enums';

/**
 * Utility functions for working with enums
 */
export class EnumUtils {
  /**
   * Convert a string to ChatMode enum value
   */
  static stringToChatMode(mode: string | ChatMode): ChatMode {
    // If already a ChatMode enum value, return as is
    if (typeof mode !== 'string') {
      return mode;
    }

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
   * Convert a string to ChatPosition enum value
   */
  static stringToChatPosition(position: string | ChatPosition): ChatPosition {
    // If already a ChatPosition enum value, return as is
    if (typeof position !== 'string') {
      return position;
    }

    const normalizedPosition = position.toLowerCase().trim();
    
    switch (normalizedPosition) {
      case 'bottom-right':
        return ChatPosition.BottomRight;
      case 'bottom-left':
        return ChatPosition.BottomLeft;
      default:
        return ChatPosition.BottomRight;
    }
  }

  /**
   * Convert a string to TokenEnforcementMode enum value
   */
  static stringToTokenEnforcementMode(mode: string | TokenEnforcementMode): TokenEnforcementMode {
    // If already a TokenEnforcementMode enum value, return as is
    if (typeof mode !== 'string') {
      return mode;
    }

    const normalizedMode = mode.toLowerCase().trim();
    
    switch (normalizedMode) {
      case 'none':
        return TokenEnforcementMode.None;
      case 'warn':
        return TokenEnforcementMode.Warn;
      case 'soft':
        return TokenEnforcementMode.Soft;
      case 'hard':
        return TokenEnforcementMode.Hard;
      case 'always':
        return TokenEnforcementMode.Always;
      case 'never':
        return TokenEnforcementMode.Never;
      case 'role_based':
      case 'role-based':
        return TokenEnforcementMode.RoleBased;
      case 'mode_based':
      case 'mode-based':
        return TokenEnforcementMode.ModeBased;
      case 'strict':
        return TokenEnforcementMode.Strict;
      default:
        return TokenEnforcementMode.None;
    }
  }

  /**
   * Convert a string to MessageRole enum value
   */
  static stringToMessageRole(role: string | MessageRole): MessageRole {
    if (typeof role !== 'string') {
      return role;
    }

    const normalizedRole = role.toLowerCase().trim();
    
    switch (normalizedRole) {
      case 'user':
        return MessageRole.User;
      case 'assistant':
        return MessageRole.Assistant;
      case 'system':
        return MessageRole.System;
      case 'error':
        return MessageRole.Error;
      case 'tool':
        return MessageRole.Tool;
      case 'function':
        return MessageRole.Function;
      default:
        return MessageRole.User;
    }
  }

  /**
   * Convert a string to MessageType enum value
   */
  static stringToMessageType(type: string | MessageType): MessageType {
    if (typeof type !== 'string') {
      return type;
    }

    const normalizedType = type.toLowerCase().trim();
    
    switch (normalizedType) {
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
      case 'audio':
        return MessageType.Audio;
      case 'link':
        return MessageType.Link;
      default:
        return MessageType.Text;
    }
  }

  /**
   * Convert a string to MessageStatus enum value
   */
  static stringToMessageStatus(status: string | MessageStatus): MessageStatus {
    if (typeof status !== 'string') {
      return status;
    }

    const normalizedStatus = status.toLowerCase().trim();
    
    switch (normalizedStatus) {
      case 'pending':
        return MessageStatus.Pending;
      case 'sending':
        return MessageStatus.Sending;
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
      case 'canceled':
        return MessageStatus.Canceled;
      case 'delivered':
        return MessageStatus.Delivered;
      default:
        return MessageStatus.Pending;
    }
  }

  /**
   * Convert a string to database-friendly format for a chat mode
   */
  static chatModeToDatabase(mode: ChatMode): string {
    return mode.toString().toLowerCase();
  }

  /**
   * Get user-friendly label for a chat mode
   */
  static getChatModeLabel(mode: ChatMode): string {
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
   * Get user-friendly label for a message role
   */
  static getMessageRoleLabel(role: MessageRole): string {
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
   * Get user-friendly label for a message type
   */
  static getMessageTypeLabel(type: MessageType): string {
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
      default:
        return 'Unknown';
    }
  }
}
