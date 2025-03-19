
/**
 * UI Layout types for the chat client
 */
import { ChatUIPreferences } from './ui';

export interface LayoutState {
  isMinimized: boolean;
  scale: number;
  showSidebar: boolean;
  uiPreferences: ChatUIPreferences;
}

export interface LayoutActions {
  setMinimized: (isMinimized: boolean) => void;
  toggleMinimized: () => void;
  setScale: (scale: number) => void;
  toggleSidebar: () => void;
  setSidebar: (visible: boolean) => void;
  updateUIPreferences: (preferences: Partial<ChatUIPreferences>) => void;
  resetLayout: () => void;
  
  // Persistence methods
  saveLayoutToStorage: () => Promise<boolean>;
  loadLayoutFromStorage: () => Promise<boolean>;
}

export type LayoutStore = LayoutState & LayoutActions;
