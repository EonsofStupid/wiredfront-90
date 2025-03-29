
import { ChatMode, MessageRole, MessageStatus, MessageType } from '@/types/chat/enums';
import { UiChatMode, databaseModeToUiMode, uiModeToChatMode } from '@/components/chat/types/enums-mapper';
import { chatModeForDatabase, databaseStringToChatMode } from '@/components/chat/types/chat-modes';
import { EnumUtilsExtensions } from './EnumUtilsExtensions';

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
    return EnumUtilsExtensions.safeParse(enumName, value, fallback);
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
      return EnumUtilsExtensions.stringToChatMode(normalizedValue).toString();
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

  // Add all extension methods to the main class
  static uiModeToChatMode = EnumUtilsExtensions.uiModeToChatMode;
  static chatModeToUiMode = EnumUtilsExtensions.chatModeToUiMode;
  static stringToChatMode = EnumUtilsExtensions.stringToChatMode;
  static chatModeForDatabase = EnumUtilsExtensions.chatModeForDatabase;
  static databaseStringToChatMode = EnumUtilsExtensions.databaseStringToChatMode;
  static messageTypeToString = EnumUtilsExtensions.messageTypeToString;
  static messageRoleToString = EnumUtilsExtensions.messageRoleToString;
  static messageStatusToString = EnumUtilsExtensions.messageStatusToString;
  static stringToEnforcementMode = EnumUtilsExtensions.stringToEnforcementMode;
}
