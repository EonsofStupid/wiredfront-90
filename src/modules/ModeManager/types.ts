
import { ChatMode } from '@/types/chat/enums';

// Define the interface for a chat mode configuration
export interface ModeConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  route?: string;
  requiredFeatures?: string[];
}

// Context type for the mode provider
export interface ModeContextType {
  currentMode: ChatMode;
  setMode: (mode: ChatMode) => void;
  isEditorPage: boolean;
  availableModes: ModeConfig[];
}

// Legacy type definitions (for backward compatibility)
export type ChatMode = 'standard' | 'developer' | 'image' | 'training';

// Define the available chat modes
export const CHAT_MODES: Record<string, ModeConfig> = {
  standard: {
    id: 'standard',
    name: 'Standard',
    description: 'General purpose chat assistant',
    icon: 'MessageSquare',
    route: '/'
  },
  developer: {
    id: 'developer',
    name: 'Developer',
    description: 'Coding assistant for development',
    icon: 'Code',
    route: '/editor',
    requiredFeatures: ['codeAssistant']
  },
  image: {
    id: 'image',
    name: 'Image',
    description: 'Create and edit images',
    icon: 'Image',
    route: '/gallery',
    requiredFeatures: ['imageGeneration']
  },
  training: {
    id: 'training',
    name: 'Training',
    description: 'Guided learning experience',
    icon: 'GraduationCap',
    route: '/training',
    requiredFeatures: ['training']
  },
};
