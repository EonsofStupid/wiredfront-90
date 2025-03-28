
import { ChatMode } from '@/types/chat/enums';
import { TaskType } from '@/types/chat/communication';

// Define the interface for a chat mode configuration
export interface ModeConfig {
  id: string;
  name: string;
  displayName?: string;
  description: string;
  icon: string;
  route?: string;
  requiredFeatures?: string[];
  defaultProvider?: string;
  defaultTaskType?: TaskType;
}

// Context type for the mode provider
export interface ModeContextType {
  currentMode: ChatMode;
  setMode: (mode: ChatMode) => void;
  isEditorPage: boolean;
  availableModes: ModeConfig[];
  currentTaskType?: TaskType;
  setTaskType?: (taskType: TaskType) => void;
  availableTaskTypes?: TaskType[];
}

// Legacy type definitions (for backward compatibility)
// Using distinct type name to avoid conflicts
export type ModeLegacyType = 'standard' | 'developer' | 'image' | 'training';

// Define the available chat modes
export const CHAT_MODES: Record<string, ModeConfig> = {
  standard: {
    id: 'standard',
    name: 'Standard',
    displayName: 'Chat',
    description: 'General purpose chat assistant',
    icon: 'MessageSquare',
    route: '/'
  },
  developer: {
    id: 'developer',
    name: 'Developer',
    displayName: 'Developer',
    description: 'Coding assistant for development',
    icon: 'Code',
    route: '/editor',
    requiredFeatures: ['codeAssistant']
  },
  image: {
    id: 'image',
    name: 'Image',
    displayName: 'Image',
    description: 'Create and edit images',
    icon: 'Image',
    route: '/gallery',
    requiredFeatures: ['imageGeneration']
  },
  training: {
    id: 'training',
    name: 'Training',
    displayName: 'Training',
    description: 'Guided learning experience',
    icon: 'GraduationCap',
    route: '/training',
    requiredFeatures: ['training']
  },
};
