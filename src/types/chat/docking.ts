
/**
 * Docking-specific type definitions for the chat system
 */
import { DockPosition } from './layout';

// Docking state
export interface ChatDocking {
  docked: boolean;
  position: DockPosition;
  dockedItems: Record<string, DockPosition>;
}

// Docking preferences
export interface DockingPreferences {
  snapToEdges: boolean;
  preferredEdge: 'right' | 'left' | 'bottom' | 'top';
  dockThreshold: number;
}

// Default docking configuration
export const DEFAULT_CHAT_DOCKING: ChatDocking = {
  docked: true,
  position: 'bottom-right',
  dockedItems: {}
};

// Default docking preferences
export const DEFAULT_DOCKING_PREFERENCES: DockingPreferences = {
  snapToEdges: true,
  preferredEdge: 'right',
  dockThreshold: 20
};
