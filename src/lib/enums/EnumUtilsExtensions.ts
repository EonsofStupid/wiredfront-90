
import { 
  ChatMode, 
  MessageRole, 
  MessageStatus, 
  MessageType,
  TokenEnforcementMode 
} from '@/types/chat/enums';
import { UiChatMode, databaseModeToUiMode, uiModeToChatMode } from '@/components/chat/shared/types/enums-mapper';

/**
 * Extensions to the EnumUtils class with additional utilities
 */
export class EnumUtilsExtensions {
  /**
   * Convert UI mode to database ChatMode enum
   */
  static uiModeToChatMode(uiMode: UiChatMode): ChatMode {
    return uiModeToChatMode[uiMode] || ChatMode.Chat;
  }

  /**
   * Convert database ChatMode enum to UI mode
   */
  static chatModeToUiMode(chatMode: ChatMode): UiChatMode {
    return databaseModeToUiMode[chatMode] || 'standard';
  }

  /**
   * Convert string to ChatMode enum
   */
  static stringToChatMode(mode: string): ChatMode {
    const normalizedMode = mode.trim().toLowerCase();
    
    switch (normalizedMode) {
      case 'chat':
      case 'standard':
        return ChatMode.Chat;
      case 'dev':
      case 'developer':
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
      default:
        return ChatMode.Chat;
    }
  }
  
  /**
   * Convert ChatMode enum to database string
   */
  static chatModeForDatabase(mode: ChatMode): string {
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
      default:
        return 'chat';
    }
  }
  
  /**
   * Convert database string to ChatMode enum
   */
  static databaseStringToChatMode(mode: string): ChatMode {
    switch (mode) {
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
      case 'editor':
        return ChatMode.Editor;
      default:
        return ChatMode.Chat;
    }
  }
  
  /**
   * Convert MessageType enum to string for database
   */
  static messageTypeToString(type: MessageType): string {
    return type.toString();
  }
  
  /**
   * Convert MessageRole enum to string for database
   */
  static messageRoleToString(role: MessageRole): string {
    return role.toString();
  }
  
  /**
   * Convert MessageStatus enum to string for database
   */
  static messageStatusToString(status: MessageStatus): string {
    return status.toString();
  }
  
  /**
   * Convert string to TokenEnforcementMode enum
   */
  static stringToEnforcementMode(value: string): TokenEnforcementMode {
    const normalizedValue = value.trim().toLowerCase();
    
    switch (normalizedValue) {
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
      case 'rolebased':
        return TokenEnforcementMode.RoleBased;
      case 'mode_based':
      case 'modebased':
        return TokenEnforcementMode.ModeBased;
      case 'strict':
        return TokenEnforcementMode.Strict;
      default:
        return TokenEnforcementMode.Warn;
    }
  }
  
  /**
   * Safely parse a string to TokenEnforcementMode with fallback
   */
  static safeParse(enumName: string, value: string, fallback: string = ''): any {
    try {
      if (enumName === 'TokenEnforcementMode') {
        return this.stringToEnforcementMode(value);
      }
      return value;
    } catch (error) {
      return fallback || value;
    }
  }
}
