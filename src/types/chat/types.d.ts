
/**
 * Core chat system type definitions
 * This file is the single source of truth for chat-related types
 */

// Chat modes
export type ChatMode = 'chat' | 'dev' | 'image' | 'training' | 'code' | 'planning';

// UI Positioning
export type ChatPositionType = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
export interface ChatPosition {
  x: number;
  y: number;
}

// UI States
export type ChatScale = number;
export type ChatTheme = 'light' | 'dark' | 'system' | 'cyberpunk';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed' | 'pending' | 'error' | 'cached';
export type MessageRole = 'user' | 'assistant' | 'system' | 'error' | 'warning' | 'info';
export type DockPosition = 'left' | 'right' | 'bottom' | 'top' | 'floating' | 'hidden';

// UI Preferences
export interface ChatUIPreferences {
  theme: ChatTheme;
  fontSize: 'small' | 'medium' | 'large';
  messageBehavior: 'enter_send' | 'ctrl_enter_send' | 'shift_enter_send';
  notifications: boolean;
  soundEnabled?: boolean;
  typingIndicators?: boolean;
  showTimestamps?: boolean;
  saveHistory?: boolean;
}

// Messages
export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: string;
  message_status?: MessageStatus;
  status?: MessageStatus; // For backward compatibility
  metadata?: Record<string, any>;
  session_id?: string;
  user_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Layout State
export interface LayoutState {
  isMinimized: boolean;
  isOpen: boolean;
  docked: boolean;
  position: ChatPosition;
  scale: ChatScale;
  showSidebar: boolean;
  theme: ChatTheme;
  uiPreferences: ChatUIPreferences;
}

// Default layout configuration
export const DEFAULT_LAYOUT: LayoutState = {
  isMinimized: false,
  isOpen: false,
  docked: true,
  position: { x: 0, y: 0 },
  scale: 1,
  showSidebar: false,
  theme: 'system',
  uiPreferences: {
    theme: 'system',
    fontSize: 'medium',
    messageBehavior: 'enter_send',
    notifications: true,
    soundEnabled: true,
    typingIndicators: true,
    showTimestamps: true,
    saveHistory: true
  }
};
