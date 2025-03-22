
/**
 * UI-specific type definitions for the chat system
 */

// Theme options for the chat UI
export type ChatTheme = 'light' | 'dark' | 'system' | 'cyberpunk';

// Font size options
export type ChatFontSize = 'small' | 'medium' | 'large';

// Docking position options
export type DockPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

// Scale options for the chat window
export type ChatScale = number;

// Position interface for the chat window
export interface ChatPosition {
  x: number;
  y: number;
}

// Message behavior options
export type MessageBehavior = 'enter_send' | 'ctrl_enter_send' | 'click_send';

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
