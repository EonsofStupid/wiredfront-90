
import { ChatMode } from '@/components/chat/types/chat/enums';

// Re-export the TaskType type
export type { TaskType } from '@/components/chat/types/chat/enums';

/**
 * Mode configuration interface
 */
export interface ModeConfig {
  id: ChatMode;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  requiredFeatures?: string[];
  defaultProvider?: string;
}

/**
 * Mode context interface
 */
export interface ModeContextType {
  currentMode: ChatMode;
  setMode: (mode: ChatMode | string) => void;
  availableModes: ModeConfig[];
  isEditorPage: boolean;
}

/**
 * Mode manager state interface
 */
export interface ModeState {
  currentMode: ChatMode;
  availableModes: ModeConfig[];
  isEditorPage: boolean;
}

/**
 * Default chat modes configuration
 */
export const CHAT_MODES: ModeConfig[] = [
  {
    id: ChatMode.Chat,
    name: 'standard',
    displayName: 'Chat',
    description: 'General chat assistant',
    icon: 'message-square',
    requiredFeatures: ['standardChat'],
    defaultProvider: 'openai'
  },
  {
    id: ChatMode.Dev,
    name: 'editor',
    displayName: 'Developer',
    description: 'Code and development assistance',
    icon: 'code',
    requiredFeatures: ['codeAssistant'],
    defaultProvider: 'openai'
  },
  {
    id: ChatMode.Image,
    name: 'image',
    displayName: 'Image',
    description: 'Image generation and editing',
    icon: 'image',
    requiredFeatures: ['imageGeneration'],
    defaultProvider: 'stability'
  },
  {
    id: ChatMode.Training,
    name: 'training',
    displayName: 'Training',
    description: 'Learning and education assistance',
    icon: 'book-open',
    requiredFeatures: ['training'],
    defaultProvider: 'openai'
  }
];
