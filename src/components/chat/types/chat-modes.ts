
import { ChatMode } from '@/types/chat/enums';

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
}

/**
 * Default chat modes available in the application
 */
export const DEFAULT_CHAT_MODES: ChatModeDefinition[] = [
  {
    id: ChatMode.Chat,
    name: 'Chat',
    description: 'Standard chat interface',
    icon: 'message-circle'
  },
  {
    id: ChatMode.Dev,
    name: 'Developer',
    description: 'Coding assistant and editor integration',
    icon: 'code'
  },
  {
    id: ChatMode.Image,
    name: 'Image',
    description: 'Image generation and manipulation',
    icon: 'image'
  },
  {
    id: ChatMode.Training,
    name: 'Training',
    description: 'Educational mode with guided learning',
    icon: 'book-open'
  },
  {
    id: ChatMode.Planning,
    name: 'Planning',
    description: 'Task and project planning',
    icon: 'trello'
  },
  {
    id: ChatMode.Code,
    name: 'Code',
    description: 'Focused code generation',
    icon: 'terminal'
  }
];
