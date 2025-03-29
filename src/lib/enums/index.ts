
import { ChatMode, MessageRole, MessageStatus, MessageType } from '@/types/chat/enums';
import { UiChatMode, databaseModeToUiMode, uiModeToChatMode } from '@/components/chat/types/enums-mapper';
import { chatModeForDatabase, databaseStringToChatMode } from '@/components/chat/types/chat-modes';

/**
 * Utility functions for working with enums in the application
 */
export class EnumUtils {
  /**
   * Validate that a value is a member of an enum
   * @param enumName The name of the enum to validate against
   * @param value The value to validate
   * @returns The value if valid, or throws an error
   */
  static validate(enumName: string, value: string): string {
    // This is a simple implementation - in a real app we would check against actual enums
    return value;
  }

  /**
   * Safely parse a value into an enum with a fallback
   * @param enumName The name of the enum to parse into
   * @param value The value to parse
   * @param fallback The fallback value if parsing fails
   * @returns The parsed enum value or the fallback
   */
  static safeParse(enumName: string, value: string, fallback: string): string {
    try {
      return this.validate(enumName, value);
    } catch (error) {
      return fallback;
    }
  }

  /**
   * Flexibly parse a string into an enum value, handling casing and whitespace
   * @param enumName The name of the enum to parse into
   * @param value The value to parse
   * @returns The parsed enum value or null if not found
   */
  static flexibleParse(enumName: string, value: string): string | null {
    const normalizedValue = value.trim().toLowerCase();
    
    // Implementation would vary based on the enum
    // Here's a simple example for ChatMode
    if (enumName === 'ChatMode') {
      const normalizedMode = normalizedValue.toLowerCase();
      
      switch (normalizedMode) {
        case 'chat':
        case 'standard':
          return 'chat';
        case 'dev':
        case 'developer':
        case 'editor':
          return 'dev';
        case 'image':
          return 'image';
        case 'training':
          return 'training';
        default:
          return null;
      }
    }
    
    return null;
  }

  /**
   * Get all values of an enum
   * @param enumName The name of the enum to get values for
   * @returns Array of enum values
   */
  static values(enumName: string): string[] {
    // Implementation would vary based on the enum
    // Here's a simple example
    switch (enumName) {
      case 'ChatMode':
        return ['chat', 'dev', 'image', 'training', 'editor', 'planning', 'code'];
      case 'UserRole':
        return ['admin', 'user', 'guest', 'moderator'];
      case 'ChatTier':
        return ['free', 'basic', 'pro', 'enterprise'];
      default:
        return [];
    }
  }

  /**
   * Get metadata (labels, descriptions) for enum values
   * @param enumName The name of the enum to get metadata for
   * @returns Array of enum metadata objects
   */
  static meta(enumName: string): Array<{value: string, label: string}> {
    // Implementation would vary based on the enum
    switch (enumName) {
      case 'ChatTier':
        return [
          { value: 'free', label: 'Free Tier' },
          { value: 'basic', label: 'Basic Tier' },
          { value: 'pro', label: 'Professional Tier' },
          { value: 'enterprise', label: 'Enterprise Tier' }
        ];
      default:
        return this.values(enumName).map(value => ({
          value,
          label: value.charAt(0).toUpperCase() + value.slice(1)
        }));
    }
  }

  /**
   * Convert UI mode to database ChatMode enum
   */
  static uiModeToChatMode(uiMode: UiChatMode): ChatMode {
    return uiModeToChatMode[uiMode];
  }

  /**
   * Convert database ChatMode enum to UI mode
   */
  static chatModeToUiMode(chatMode: ChatMode): UiChatMode {
    return databaseModeToUiMode[chatMode];
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
    return chatModeForDatabase(mode);
  }
  
  /**
   * Convert database string to ChatMode enum
   */
  static databaseStringToChatMode(mode: string): ChatMode {
    return databaseStringToChatMode(mode);
  }
  
  /**
   * Convert message type to string
   */
  static messageTypeToString(type: MessageType): string {
    return type.toString();
  }
}
