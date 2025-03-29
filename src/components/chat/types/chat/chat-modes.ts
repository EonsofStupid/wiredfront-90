
import { ChatMode } from '@/types/enums';
import { EnumUtils } from '@/lib/enums';

export type UiChatMode = 'standard' | 'editor' | 'image' | 'training' | 'planning' | 'code' | 'document' | 'audio';

/**
 * Chat mode configuration
 */
export interface ModeConfig {
  id: ChatMode;
  displayName: string;
  description: string;
  icon: string;
  requiredFeatures?: string[];
  defaultProvider?: string;
}

/**
 * Default available chat modes
 */
export const DEFAULT_CHAT_MODES: ModeConfig[] = [
  {
    id: ChatMode.Chat,
    displayName: 'Chat',
    description: 'Standard chat mode',
    icon: 'message-square',
    requiredFeatures: ['standardChat']
  },
  {
    id: ChatMode.Dev,
    displayName: 'Editor',
    description: 'Code editor mode',
    icon: 'code',
    requiredFeatures: ['codeAssistant']
  },
  {
    id: ChatMode.Image,
    displayName: 'Image Generation',
    description: 'Generate images',
    icon: 'image',
    requiredFeatures: ['imageGeneration']
  },
  {
    id: ChatMode.Training,
    displayName: 'Training',
    description: 'Learning mode',
    icon: 'book-open',
    requiredFeatures: ['training']
  }
];

/**
 * Get available chat modes based on enabled features
 */
export function getAvailableChatModes(enabledFeatures: Record<string, boolean>): ModeConfig[] {
  return DEFAULT_CHAT_MODES.filter(mode => {
    if (!mode.requiredFeatures || mode.requiredFeatures.length === 0) {
      return true;
    }
    return mode.requiredFeatures.every(feature => enabledFeatures[feature]);
  });
}

/**
 * Check if a chat mode is available based on enabled features
 */
export function isChatModeAvailable(mode: ChatMode, enabledFeatures: Record<string, boolean>): boolean {
  const modeConfig = DEFAULT_CHAT_MODES.find(m => m.id === mode);
  if (!modeConfig || !modeConfig.requiredFeatures || modeConfig.requiredFeatures.length === 0) {
    return true;
  }
  return modeConfig.requiredFeatures.every(feature => enabledFeatures[feature]);
}

/**
 * Convert UI chat mode to internal ChatMode enum
 */
export function uiModeToChatMode(uiMode: UiChatMode): ChatMode {
  return EnumUtils.uiModeToChatMode(uiMode);
}

/**
 * Convert internal ChatMode enum to UI chat mode
 */
export function databaseModeToUiMode(dbMode: ChatMode): UiChatMode {
  return EnumUtils.chatModeToUiMode(dbMode);
}
