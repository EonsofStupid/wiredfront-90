
import { ChatButtonSettings } from '@/types/chat/button-styles';

const CHAT_SETTINGS_KEY = 'chat_settings';

export interface ChatSettings {
  appearance: {
    position: 'bottom-right' | 'bottom-left';
    buttonStyle: string;
    buttonSize: 'small' | 'medium' | 'large';
    buttonColor: string;
    chatWidth: number;
    chatHeight: number;
  };
  behavior: {
    startMinimized: boolean;
    showTimestamps: boolean;
    saveHistory: boolean;
    autoComplete: boolean;
    darkMode: boolean;
  };
  notifications: {
    soundEnabled: boolean;
    desktopNotifications: boolean;
  };
  providers: {
    defaultProvider: string;
    defaultModel: string;
  };
}

const defaultSettings: ChatSettings = {
  appearance: {
    position: 'bottom-right',
    buttonStyle: 'ultra',  // Set "Ultra" as default
    buttonSize: 'medium',
    buttonColor: '#0EA5E9',
    chatWidth: 400,
    chatHeight: 500,
  },
  behavior: {
    startMinimized: false,
    showTimestamps: true,
    saveHistory: true,
    autoComplete: true,
    darkMode: true,
  },
  notifications: {
    soundEnabled: true,
    desktopNotifications: false,
  },
  providers: {
    defaultProvider: 'openai',
    defaultModel: 'gpt-3.5-turbo',
  }
};

export const getChatSettings = (): ChatSettings => {
  try {
    const stored = localStorage.getItem(CHAT_SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return defaultSettings;
  } catch (error) {
    console.error('Error reading chat settings:', error);
    return defaultSettings;
  }
};

export const saveChatSettings = (settings: ChatSettings): void => {
  try {
    localStorage.setItem(CHAT_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving chat settings:', error);
  }
};

export const resetChatSettings = (): void => {
  try {
    localStorage.setItem(CHAT_SETTINGS_KEY, JSON.stringify(defaultSettings));
  } catch (error) {
    console.error('Error resetting chat settings:', error);
  }
}; 
