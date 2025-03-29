
import { ChatMode } from '@/types/chat/enums';

export { TokenEnforcementMode } from '@/types/chat/tokens';

/**
 * Convert ChatMode enum to database-friendly string
 */
export const chatModeForDatabase = (mode: ChatMode): string => {
  switch (mode) {
    case ChatMode.Chat:
      return 'chat';
    case ChatMode.Dev:
    case ChatMode.Editor:
      return 'dev';
    case ChatMode.Image:
      return 'image';
    case ChatMode.Training:
      return 'training';
    case ChatMode.Planning:
      return 'planning';
    case ChatMode.Code:
      return 'code';
    default:
      return 'chat';
  }
};

/**
 * Convert database string to ChatMode enum
 */
export const databaseStringToChatMode = (mode: string): ChatMode => {
  switch (mode) {
    case 'chat':
      return ChatMode.Chat;
    case 'dev':
      return ChatMode.Dev;
    case 'image':
      return ChatMode.Image;
    case 'training':
      return ChatMode.Training;
    case 'planning':
      return ChatMode.Planning;
    case 'code':
      return ChatMode.Code;
    case 'editor':
      return ChatMode.Editor;
    default:
      return ChatMode.Chat;
  }
};

/**
 * Standard interface for chat modes
 */
export interface ChatModeDefinition {
  id: ChatMode;
  name: string;
  description: string;
  icon: string;
  requiredFeatures?: string[];
  isEnabled?: boolean;
}

/**
 * Default chat modes
 */
export const DEFAULT_CHAT_MODES: ChatModeDefinition[] = [
  {
    id: ChatMode.Chat,
    name: 'Chat',
    description: 'Standard conversation',
    icon: 'MessageSquare',
    isEnabled: true
  },
  {
    id: ChatMode.Dev,
    name: 'Developer',
    description: 'Code assistance',
    icon: 'Code',
    requiredFeatures: ['codeAssistant'],
    isEnabled: true
  },
  {
    id: ChatMode.Image,
    name: 'Image',
    description: 'Create images',
    icon: 'Image',
    requiredFeatures: ['imageGeneration'],
    isEnabled: true
  },
  {
    id: ChatMode.Training,
    name: 'Training',
    description: 'Learning assistant',
    icon: 'GraduationCap',
    requiredFeatures: ['training'],
    isEnabled: true
  },
  {
    id: ChatMode.Planning,
    name: 'Planning',
    description: 'Project planning',
    icon: 'ListTodo',
    requiredFeatures: ['planning'],
    isEnabled: false
  }
];
