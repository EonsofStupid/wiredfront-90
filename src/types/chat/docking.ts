
/**
 * Docking types for the chat client
 */
import { ChatPosition } from './ui';

export type DockPosition = 'left' | 'right' | 'bottom' | 'top' | 'floating' | 'hidden';

export interface DockingState {
  docked: boolean;
  position: ChatPosition;
  dockedItems: Record<string, DockPosition>;
}

export interface DockingActions {
  setDocked: (docked: boolean) => void;
  toggleDocked: () => void;
  setPosition: (position: ChatPosition) => void;
  setDockedItem: (id: string, position: DockPosition) => void;
  resetDocking: () => void;
  
  // Persistence methods
  saveDockingToStorage: () => Promise<boolean>;
  loadDockingFromStorage: () => Promise<boolean>;
}

export type DockingStore = DockingState & DockingActions;
