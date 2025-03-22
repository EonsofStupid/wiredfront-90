
/**
 * Re-export chat types from the central type definition
 */
import type { 
  ChatMode, 
  Message, 
  Session,
  ChatTheme,
  ChatScale,
  MessageRole,
  MessageStatus,
  DockPosition,
  ChatUIPreferences
} from '@/types/chat';

// Re-export the types
export type { 
  ChatMode, 
  Message, 
  Session,
  ChatTheme,
  ChatScale,
  MessageRole,
  MessageStatus,
  DockPosition,
  ChatUIPreferences
};

// UI Positioning
export type ChatPositionType = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
export interface ChatPosition {
  x: number;
  y: number;
}

// UI States
export type ChatLayoutState = {
  isMinimized: boolean;
  isOpen: boolean;
  docked: boolean;
  position: ChatPosition;
  scale: ChatScale;
  showSidebar: boolean;
  theme: ChatTheme;
  uiPreferences: ChatUIPreferences;
};

// Default layout configuration
export const DEFAULT_LAYOUT: ChatLayoutState = {
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
