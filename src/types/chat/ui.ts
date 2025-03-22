
/**
 * UI-specific type definitions for the chat system
 */

// Theme options for the chat UI
export type ChatTheme = 'light' | 'dark' | 'system' | 'cyberpunk';

// Font size options
export type ChatFontSize = 'small' | 'medium' | 'large';

// Message behavior options
export type MessageBehavior = 'enter_send' | 'ctrl_enter_send' | 'shift_enter_send';

// UI preferences for the chat
export interface ChatUIPreferences {
  theme: ChatTheme;
  fontSize: ChatFontSize;
  messageBehavior: MessageBehavior;
  notifications: boolean;
  soundEnabled: boolean;
  typingIndicators: boolean;
  showTimestamps: boolean;
  saveHistory: boolean;
}

// Default UI preferences
export const DEFAULT_UI_PREFERENCES: ChatUIPreferences = {
  theme: 'system',
  fontSize: 'medium',
  messageBehavior: 'enter_send',
  notifications: true,
  soundEnabled: true,
  typingIndicators: true,
  showTimestamps: true,
  saveHistory: true
};
