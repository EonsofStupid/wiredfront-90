
import { 
  ChatMode, 
  MessageRole, 
  MessageStatus, 
  MessageType,
  TokenEnforcementMode,
  TaskType
} from '@/components/chat/types/chat/enums';
import { EnumUtils } from './EnumUtils';

/**
 * Extensions to the EnumUtils class with additional utilities
 * This class is being deprecated in favor of the main EnumUtils class.
 * Kept for backward compatibility but should not be extended further.
 */
export class EnumUtilsExtensions {
  /**
   * Convert UI mode to database ChatMode enum
   */
  static uiModeToChatMode(uiMode: string): ChatMode {
    return EnumUtils.uiModeToChatMode(uiMode);
  }

  /**
   * Convert database ChatMode enum to UI mode
   */
  static chatModeToUiMode(chatMode: ChatMode): string {
    return EnumUtils.chatModeToUiMode(chatMode);
  }

  /**
   * Convert string to ChatMode enum
   */
  static stringToChatMode(mode: string): ChatMode {
    return EnumUtils.stringToChatMode(mode);
  }
  
  /**
   * Convert ChatMode enum to database string
   */
  static chatModeForDatabase(mode: ChatMode): string {
    return EnumUtils.chatModeForDatabase(mode);
  }
  
  /**
   * Convert database string to ChatMode enum
   */
  static databaseStringToChatMode(mode: string): ChatMode {
    return EnumUtils.databaseStringToChatMode(mode);
  }
  
  /**
   * Convert MessageType enum to string for database
   */
  static messageTypeToString(type: MessageType): string {
    return EnumUtils.messageTypeToString(type);
  }
  
  /**
   * Convert MessageRole enum to string for database
   */
  static messageRoleToString(role: MessageRole): string {
    return EnumUtils.messageRoleToString(role);
  }
  
  /**
   * Convert MessageStatus enum to string for database
   */
  static messageStatusToString(status: MessageStatus): string {
    return EnumUtils.messageStatusToString(status);
  }
  
  /**
   * Convert string to TokenEnforcementMode enum
   */
  static stringToTokenEnforcementMode(value: string): TokenEnforcementMode {
    return EnumUtils.stringToTokenEnforcementMode(value);
  }
  
  /**
   * Convert string to TaskType enum
   */
  static stringToTaskType(value: string): TaskType {
    return EnumUtils.stringToTaskType(value);
  }
  
  /**
   * Safely parse a string to TokenEnforcementMode with fallback
   */
  static safeParse(enumName: string, value: string, fallback: string = ''): any {
    return EnumUtils.safeParse(enumName, value, fallback);
  }
}
