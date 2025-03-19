
/**
 * UI and layout types for the chat client
 */

// Dock positions for UI elements
export type DockPosition = 'left' | 'right' | 'bottom' | 'top' | 'floating' | 'hidden';

// Chat window position
export interface ChatPosition {
  x: number;
  y: number;
}

// Chat window scale
export type ChatScale = number;

// Chat theme
export type ChatTheme = 'light' | 'dark' | 'system' | 'cyberpunk';

// Chat UI preferences
export interface ChatUIPreferences {
  theme: ChatTheme;
  fontSize: 'small' | 'medium' | 'large';
  messageBehavior: 'enter_send' | 'ctrl_enter_send';
  notifications: boolean;
  soundEnabled?: boolean;
  typingIndicators?: boolean;
  showTimestamps?: boolean;
}

// Chat layout state
export interface ChatLayoutState {
  isMinimized: boolean;
  docked: boolean;
  position: ChatPosition;
  scale: ChatScale;
  showSidebar: boolean;
  dockedItems?: Record<string, DockPosition>;
  uiPreferences: ChatUIPreferences;
}
