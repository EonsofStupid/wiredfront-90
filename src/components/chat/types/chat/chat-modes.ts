
import { ChatMode } from './enums';
import { EnumUtils } from '@/lib/enums';

/**
 * UI-friendly chat mode type
 */
export type UiChatMode = 'standard' | 'editor' | 'image' | 'training' | 'planning' | 'code' | 'document' | 'audio';

/**
 * Map between UI chat modes and internal ChatMode enum values
 */
export const UiModeToChatMode: Record<UiChatMode, ChatMode> = {
  'standard': ChatMode.Chat,
  'editor': ChatMode.Dev,
  'image': ChatMode.Image,
  'training': ChatMode.Training,
  'planning': ChatMode.Planning,
  'code': ChatMode.Code,
  'document': ChatMode.Document,
  'audio': ChatMode.Audio
};

/**
 * Map between internal ChatMode enum values and UI chat modes
 */
export const ChatModeToUiMode: Record<ChatMode, UiChatMode> = {
  [ChatMode.Chat]: 'standard',
  [ChatMode.Dev]: 'editor',
  [ChatMode.Editor]: 'editor',
  [ChatMode.Image]: 'image',
  [ChatMode.Training]: 'training',
  [ChatMode.Planning]: 'planning',
  [ChatMode.Code]: 'code',
  [ChatMode.Document]: 'document',
  [ChatMode.Audio]: 'audio'
};

/**
 * Mode configuration interface for defining available chat modes
 */
export interface ModeConfig {
  id: ChatMode;
  name: string;
  description: string;
  icon: string;
  requiredFeatures: string[];
}

/**
 * Default chat mode configuration
 */
export const DEFAULT_CHAT_MODES: ModeConfig[] = [
  {
    id: ChatMode.Chat,
    name: 'Chat',
    description: 'General chat assistant',
    icon: EnumUtils.getChatModeIcon(ChatMode.Chat),
    requiredFeatures: ['standardChat']
  },
  {
    id: ChatMode.Dev,
    name: 'Developer',
    description: 'Code and development assistance',
    icon: EnumUtils.getChatModeIcon(ChatMode.Dev),
    requiredFeatures: ['codeAssistant']
  },
  {
    id: ChatMode.Image,
    name: 'Image',
    description: 'Image generation and editing',
    icon: EnumUtils.getChatModeIcon(ChatMode.Image),
    requiredFeatures: ['imageGeneration']
  },
  {
    id: ChatMode.Training,
    name: 'Training',
    description: 'Learning and education assistance',
    icon: EnumUtils.getChatModeIcon(ChatMode.Training),
    requiredFeatures: ['training']
  },
  {
    id: ChatMode.Planning,
    name: 'Planning',
    description: 'Structured planning assistance',
    icon: EnumUtils.getChatModeIcon(ChatMode.Planning),
    requiredFeatures: ['standardChat']
  },
  {
    id: ChatMode.Code,
    name: 'Code',
    description: 'Focused code assistance',
    icon: EnumUtils.getChatModeIcon(ChatMode.Code),
    requiredFeatures: ['codeAssistant']
  },
  {
    id: ChatMode.Document,
    name: 'Document',
    description: 'Document analysis and generation',
    icon: EnumUtils.getChatModeIcon(ChatMode.Document),
    requiredFeatures: ['standardChat']
  },
  {
    id: ChatMode.Audio,
    name: 'Audio',
    description: 'Audio transcription and analysis',
    icon: EnumUtils.getChatModeIcon(ChatMode.Audio),
    requiredFeatures: ['voice']
  }
];

/**
 * Helper function to get available chat modes based on enabled features
 */
export function getAvailableChatModes(enabledFeatures: string[]): ModeConfig[] {
  return DEFAULT_CHAT_MODES.filter(mode => 
    mode.requiredFeatures.every(feature => enabledFeatures.includes(feature))
  );
}

/**
 * Helper function to check if a chat mode is available based on enabled features
 */
export function isChatModeAvailable(mode: ChatMode, enabledFeatures: string[]): boolean {
  const modeConfig = DEFAULT_CHAT_MODES.find(m => m.id === mode);
  if (!modeConfig) return false;
  
  return modeConfig.requiredFeatures.every(feature => 
    enabledFeatures.includes(feature)
  );
}
