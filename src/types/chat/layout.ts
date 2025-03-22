
/**
 * Layout-specific type definitions for the chat system
 */
import { ChatPosition, ChatScale, ChatTheme, ChatUIPreferences } from './ui';

// Layout state for chat UI
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

// Layout actions
export interface LayoutActions {
  toggleMinimize: () => void;
  toggleOpen: () => void;
  toggleDocked: () => void;
  setPosition: (position: ChatPosition) => void;
  setScale: (scale: ChatScale) => void;
  toggleSidebar: () => void;
  setTheme: (theme: ChatTheme) => void;
  updatePreferences: (prefs: Partial<ChatUIPreferences>) => void;
  resetLayout: () => void;
  
  // Persistence methods
  saveLayoutToStorage: () => Promise<boolean>;
  loadLayoutFromStorage: () => Promise<boolean>;
}

// Combined layout store type
export type LayoutStore = LayoutState & LayoutActions;

/**
 * Default layout preferences
 */
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
