
import { ChatMode, ChatPosition, TokenEnforcementMode, TaskType } from '@/types/chat/enums';

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
      case 'never':
        return TokenEnforcementMode.Never;
      case 'warn':
        return TokenEnforcementMode.Warn;
      case 'soft':
        return TokenEnforcementMode.Soft;
      case 'hard':
        return TokenEnforcementMode.Hard;
      case 'always':
        return TokenEnforcementMode.Always;
      case 'role_based':
      case 'role-based':
        return TokenEnforcementMode.RoleBased;
      case 'mode_based':
      case 'mode-based':
        return TokenEnforcementMode.ModeBased;
      case 'strict':
        return TokenEnforcementMode.Strict;
      default:
        return TokenEnforcementMode.Never;
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
}
