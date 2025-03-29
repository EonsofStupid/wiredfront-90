
import { ChatMode } from '@/types/chat/enums';
import { EnumUtils } from '@/lib/enums';

/**
 * Convert a ChatMode enum to a database string representation
 */
export function chatModeForDatabase(mode: ChatMode): string {
  return EnumUtils.chatModeToString(mode);
}

/**
 * Convert a database string to a ChatMode enum value
 */
export function databaseStringToChatMode(mode: string): ChatMode {
  return EnumUtils.stringToChatMode(mode);
}

/**
 * Get label for chat mode (for display in UI)
 */
export function getChatModeLabel(mode: ChatMode): string {
  return EnumUtils.getChatModeLabel(mode);
}

/**
 * Get icon name for chat mode
 */
export function getChatModeIcon(mode: ChatMode): string {
  return EnumUtils.getChatModeIcon(mode);
}

/**
 * Standard interface for chat modes
 */
export interface ChatModeDefinition {
  id: ChatMode;
  name: string;
  description: string;
  icon: string;
  route?: string;
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
    icon: 'code',
    route: '/editor'
  },
  {
    id: ChatMode.Image,
    name: 'Image',
    description: 'Image generation and manipulation',
    icon: 'image',
    route: '/gallery'
  },
  {
    id: ChatMode.Training,
    name: 'Training',
    description: 'Educational mode with guided learning',
    icon: 'graduation-cap',
    route: '/training'
  },
  {
    id: ChatMode.Planning,
    name: 'Planning',
    description: 'Task and project planning',
    icon: 'clipboard-list',
    route: '/planning'
  },
  {
    id: ChatMode.Code,
    name: 'Code',
    description: 'Focused code generation',
    icon: 'terminal',
    route: '/code'
  },
  {
    id: ChatMode.Document,
    name: 'Document',
    description: 'Document analysis and generation',
    icon: 'file-text',
    route: '/documents'
  },
  {
    id: ChatMode.Audio,
    name: 'Audio',
    description: 'Audio transcription and processing',
    icon: 'headphones',
    route: '/audio'
  }
];
