
// Define the possible chat modes
export type ChatMode = 'standard' | 'developer' | 'image' | 'training';

// Define the interface for a chat mode configuration
export interface ChatModeConfig {
  id: ChatMode;
  name: string;
  description: string;
  icon: string;
}

// Define the available chat modes
export const CHAT_MODES: Record<ChatMode, ChatModeConfig> = {
  standard: {
    id: 'standard',
    name: 'Standard',
    description: 'General purpose chat assistant',
    icon: 'MessageSquare',
  },
  developer: {
    id: 'developer',
    name: 'Developer',
    description: 'Coding assistant for development',
    icon: 'Code',
  },
  image: {
    id: 'image',
    name: 'Image',
    description: 'Create and edit images',
    icon: 'Image',
  },
  training: {
    id: 'training',
    name: 'Training',
    description: 'Guided learning experience',
    icon: 'GraduationCap',
  },
};
