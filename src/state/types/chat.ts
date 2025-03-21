import { ChatMode } from '@/features/chat/types';

export interface ChatPosition {
  x: number;
  y: number;
}

export interface ChatPreferences {
  position: ChatPosition;
  scale: number;
  isDocked: boolean;
  isMinimized: boolean;
  showSidebar: boolean;
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  showTimestamps: boolean;
  saveHistory: boolean;
}

export interface ChatProvider {
  id: string;
  name: string;
  models: string[];
  isEnabled: boolean;
}

export interface ChatFeature {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
}

export interface ChatState {
  // UI State
  isOpen: boolean;
  isMinimized: boolean;
  showSidebar: boolean;
  position: ChatPosition;
  scale: number;
  isDocked: boolean;

  // Chat State
  currentMode: ChatMode;
  selectedModel: string;
  currentProvider: ChatProvider | null;
  availableProviders: ChatProvider[];

  // Preferences
  preferences: ChatPreferences;

  // Features
  features: Record<string, ChatFeature>;

  // Actions
  toggleChat: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  setPosition: (position: ChatPosition) => void;
  setScale: (scale: number) => void;
  setDocked: (isDocked: boolean) => void;
  setCurrentMode: (mode: ChatMode) => void;
  setSelectedModel: (model: string) => void;
  updateCurrentProvider: (provider: ChatProvider) => void;
  updatePreferences: (prefs: Partial<ChatPreferences>) => void;
  toggleFeature: (featureId: string) => void;
  resetToDefaults: () => void;
}
