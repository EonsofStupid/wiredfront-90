
/**
 * Layout-specific type definitions for the chat system
 */

// Position interface for the chat window
export interface ChatPosition {
  x: number;
  y: number;
}

// Docking position options
export type DockPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

// Scale options
export type ChatScale = number;

// Layout state for the chat window
export interface ChatLayout {
  isOpen: boolean;
  isMinimized: boolean;
  docked: boolean;
  position: ChatPosition;
  scale: ChatScale;
  showSidebar: boolean;
}

// Default layout configuration
export const DEFAULT_CHAT_LAYOUT: ChatLayout = {
  isOpen: false,
  isMinimized: false,
  docked: true,
  position: { x: 20, y: 20 },
  scale: 1,
  showSidebar: false
};
