import { ChatMode, getChatModeIcon } from './enums';

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
    id: 'chat',
    name: 'Chat',
    description: 'General chat assistant',
    icon: getChatModeIcon('chat'),
    requiredFeatures: ['standardChat']
  },
  {
    id: 'dev',
    name: 'Developer',
    description: 'Code and development assistance',
    icon: getChatModeIcon('dev'),
    requiredFeatures: ['codeAssistant']
  },
  {
    id: 'image',
    name: 'Image',
    description: 'Image generation and editing',
    icon: getChatModeIcon('image'),
    requiredFeatures: ['imageGeneration']
  },
  {
    id: 'training',
    name: 'Training',
    description: 'Learning and education assistance',
    icon: getChatModeIcon('training'),
    requiredFeatures: ['training']
  },
  {
    id: 'planning',
    name: 'Planning',
    description: 'Structured planning assistance',
    icon: getChatModeIcon('planning'),
    requiredFeatures: ['standardChat']
  },
  {
    id: 'code',
    name: 'Code',
    description: 'Focused code assistance',
    icon: getChatModeIcon('code'),
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
