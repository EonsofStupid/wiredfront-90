
import { ChatMode, ChatPosition, TokenEnforcementMode } from '@/types/chat/enums';

/**
 * Maps chat modes to their database string representations
 */
export const chatModeToDatabase: Record<ChatMode, string> = {
  [ChatMode.Chat]: 'chat',
  [ChatMode.Dev]: 'dev',
  [ChatMode.Editor]: 'editor',
  [ChatMode.Image]: 'image',
  [ChatMode.Training]: 'training',
  [ChatMode.Planning]: 'planning',
  [ChatMode.Code]: 'code',
  [ChatMode.Document]: 'document',
  [ChatMode.Audio]: 'audio'
};

/**
 * Maps chat modes to display labels
 */
export const chatModeToLabel: Record<ChatMode, string> = {
  [ChatMode.Chat]: 'Chat',
  [ChatMode.Dev]: 'Developer',
  [ChatMode.Editor]: 'Editor',
  [ChatMode.Image]: 'Image',
  [ChatMode.Training]: 'Training',
  [ChatMode.Planning]: 'Planning',
  [ChatMode.Code]: 'Code',
  [ChatMode.Document]: 'Document',
  [ChatMode.Audio]: 'Audio'
};

/**
 * Maps chat modes to icon names
 */
export const chatModeToIcon: Record<ChatMode, string> = {
  [ChatMode.Chat]: 'message-circle',
  [ChatMode.Dev]: 'code',
  [ChatMode.Editor]: 'code',
  [ChatMode.Image]: 'image',
  [ChatMode.Training]: 'graduation-cap',
  [ChatMode.Planning]: 'clipboard-list',
  [ChatMode.Code]: 'terminal',
  [ChatMode.Document]: 'file-text',
  [ChatMode.Audio]: 'headphones'
};

/**
 * Maps chat positions to their string representations
 */
export const chatPositionToString: Record<ChatPosition, string> = {
  [ChatPosition.BottomRight]: 'bottom-right',
  [ChatPosition.BottomLeft]: 'bottom-left',
  [ChatPosition.TopRight]: 'top-right',
  [ChatPosition.TopLeft]: 'top-left'
};

/**
 * Maps chat positions to display labels
 */
export const chatPositionToLabel: Record<ChatPosition, string> = {
  [ChatPosition.BottomRight]: 'Bottom Right',
  [ChatPosition.BottomLeft]: 'Bottom Left',
  [ChatPosition.TopRight]: 'Top Right',
  [ChatPosition.TopLeft]: 'Top Left'
};

/**
 * Maps database strings to chat modes
 */
export const databaseStringToChatMode = (mode: string): ChatMode => {
  const normalizedMode = mode.toLowerCase().trim();
  
  switch (normalizedMode) {
    case 'chat':
      return ChatMode.Chat;
    case 'dev':
    case 'editor':
    case 'development':
      return ChatMode.Dev;
    case 'image':
      return ChatMode.Image;
    case 'training':
      return ChatMode.Training;
    case 'planning':
      return ChatMode.Planning;
    case 'code':
      return ChatMode.Code;
    case 'document':
      return ChatMode.Document;
    case 'audio':
      return ChatMode.Audio;
    default:
      return ChatMode.Chat;
  }
};

/**
 * Maps UI chat mode to database enum
 */
export const stringToChatMode = databaseStringToChatMode;

/**
 * Maps token enforcement modes to display labels
 */
export const tokenEnforcementModeToLabel: Record<TokenEnforcementMode, string> = {
  [TokenEnforcementMode.None]: 'None',
  [TokenEnforcementMode.Never]: 'Never',
  [TokenEnforcementMode.Warn]: 'Warn',
  [TokenEnforcementMode.Soft]: 'Soft',
  [TokenEnforcementMode.Hard]: 'Hard',
  [TokenEnforcementMode.Always]: 'Always',
  [TokenEnforcementMode.RoleBased]: 'Role-Based',
  [TokenEnforcementMode.ModeBased]: 'Mode-Based',
  [TokenEnforcementMode.Strict]: 'Strict'
};

/**
 * Maps token enforcement modes to descriptions and visual styles
 */
export const tokenEnforcementModeInfo: Record<TokenEnforcementMode, { label: string; description: string; color: string }> = {
  [TokenEnforcementMode.None]: {
    label: 'None',
    description: 'No token enforcement',
    color: 'text-gray-400'
  },
  [TokenEnforcementMode.Never]: {
    label: 'Never',
    description: 'No token enforcement',
    color: 'text-gray-500'
  },
  [TokenEnforcementMode.Warn]: {
    label: 'Warn',
    description: 'Shows warnings but allows usage',
    color: 'text-yellow-500'
  },
  [TokenEnforcementMode.Soft]: {
    label: 'Soft',
    description: 'Shows errors but allows usage with degraded results',
    color: 'text-orange-500'
  },
  [TokenEnforcementMode.Hard]: {
    label: 'Hard',
    description: 'Prevents usage when tokens are depleted',
    color: 'text-red-500'
  },
  [TokenEnforcementMode.Always]: {
    label: 'Always',
    description: 'Always enforces token limits without exceptions',
    color: 'text-red-700'
  },
  [TokenEnforcementMode.RoleBased]: {
    label: 'Role-Based',
    description: 'Enforcement varies by user role',
    color: 'text-blue-500'
  },
  [TokenEnforcementMode.ModeBased]: {
    label: 'Mode-Based',
    description: 'Enforcement varies by chat mode',
    color: 'text-purple-500'
  },
  [TokenEnforcementMode.Strict]: {
    label: 'Strict',
    description: 'Strict enforcement with detailed logging',
    color: 'text-red-600'
  }
};
