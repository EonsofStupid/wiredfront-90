export interface ChatLayoutState {
  isMinimized: boolean;
  scale: number;
  showSidebar: boolean;
  uiPreferences: ChatUIPreferences;
}

export interface ChatUIPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  messageBehavior: 'enter_send' | 'shift_enter_send';
  notifications: boolean;
  showTimestamps: boolean;
}

export interface ChatLayoutActions {
  toggleMinimized: () => void;
  setMinimized: (isMinimized: boolean) => void;
  setScale: (scale: number) => void;
  toggleSidebar: () => void;
  setSidebar: (show: boolean) => void;
  updatePreferences: (preferences: Partial<ChatUIPreferences>) => void;
  reset: () => void;
  saveToStorage: () => Promise<boolean>;
  loadFromStorage: () => Promise<boolean>;
  initialize: () => Promise<void>;
}
