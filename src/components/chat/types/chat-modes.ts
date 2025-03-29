
import { ChatMode } from './chat/enums';
import { EnumUtils } from '@/lib/enums/EnumUtils';

/**
 * Default chat mode configuration
 */
export const DEFAULT_CHAT_MODES = [
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
