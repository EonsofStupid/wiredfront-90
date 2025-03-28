
import { ChatMode, getChatModeIcon } from '@/types/enums';

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
    icon: getChatModeIcon(ChatMode.Chat),
    requiredFeatures: ['standardChat']
  },
  {
    id: ChatMode.Dev,
    name: 'Developer',
    description: 'Code and development assistance',
    icon: getChatModeIcon(ChatMode.Dev),
    requiredFeatures: ['codeAssistant']
  },
  {
    id: ChatMode.Image,
    name: 'Image',
    description: 'Image generation and editing',
    icon: getChatModeIcon(ChatMode.Image),
    requiredFeatures: ['imageGeneration']
  },
  {
    id: ChatMode.Training,
    name: 'Training',
    description: 'Learning and education assistance',
    icon: getChatModeIcon(ChatMode.Training),
    requiredFeatures: ['training']
  },
  {
    id: ChatMode.Planning,
    name: 'Planning',
    description: 'Structured planning assistance',
    icon: getChatModeIcon(ChatMode.Planning),
    requiredFeatures: ['standardChat']
  },
  {
    id: ChatMode.Code,
    name: 'Code',
    description: 'Focused code assistance',
    icon: getChatModeIcon(ChatMode.Code),
    requiredFeatures: ['codeAssistant']
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
