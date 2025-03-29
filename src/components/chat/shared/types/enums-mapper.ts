
import { ChatMode, TokenEnforcementMode, UIEnforcementMode } from '@/types/chat/enums';

/**
 * UI mode representation (used in UI components)
 */
export type UiChatMode = 'standard' | 'editor' | 'image' | 'training' | 'planning' | 'code';

/**
 * Mapping from UI mode to ChatMode enum
 */
export const uiModeToChatMode: Record<UiChatMode, ChatMode> = {
  'standard': ChatMode.Chat,
  'editor': ChatMode.Dev,
  'image': ChatMode.Image,
  'training': ChatMode.Training,
  'planning': ChatMode.Planning,
  'code': ChatMode.Code
};

/**
 * Mapping from ChatMode enum to UI mode
 */
export const databaseModeToUiMode: Record<ChatMode, UiChatMode> = {
  [ChatMode.Chat]: 'standard',
  [ChatMode.Dev]: 'editor',
  [ChatMode.Editor]: 'editor',
  [ChatMode.Image]: 'image',
  [ChatMode.Training]: 'training',
  [ChatMode.Planning]: 'planning',
  [ChatMode.Code]: 'code'
};

/**
 * Mapping from TokenEnforcementMode to UI metadata
 */
export const tokenToUIEnforcementMode: Record<TokenEnforcementMode, {
  label: string;
  color: string;
  description: string;
}> = {
  [TokenEnforcementMode.None]: {
    label: 'Not Enforced',
    color: 'text-gray-500',
    description: 'Token limits are not being enforced'
  },
  [TokenEnforcementMode.Warn]: {
    label: 'Warning Only',
    color: 'text-yellow-500',
    description: 'You will be warned when you exceed token limits, but operations will not be blocked'
  },
  [TokenEnforcementMode.Soft]: {
    label: 'Soft Enforcement',
    color: 'text-orange-500',
    description: 'Some functionality will be limited when you exceed token limits'
  },
  [TokenEnforcementMode.Hard]: {
    label: 'Hard Enforcement',
    color: 'text-red-500',
    description: 'Operations will be blocked when you exceed token limits'
  },
  // Legacy values
  [TokenEnforcementMode.Always]: {
    label: 'Always Enforced',
    color: 'text-red-500',
    description: 'Token limits are always enforced'
  },
  [TokenEnforcementMode.Never]: {
    label: 'Never Enforced',
    color: 'text-gray-500',
    description: 'Token limits are never enforced'
  },
  [TokenEnforcementMode.RoleBased]: {
    label: 'Role-Based',
    color: 'text-blue-500',
    description: 'Token enforcement depends on your user role'
  },
  [TokenEnforcementMode.ModeBased]: {
    label: 'Mode-Based',
    color: 'text-purple-500',
    description: 'Token enforcement depends on the current chat mode'
  },
  [TokenEnforcementMode.Strict]: {
    label: 'Strict',
    color: 'text-red-700',
    description: 'Token limits are strictly enforced with no exceptions'
  }
};

/**
 * Mapping from UI enforcement mode to token enforcement mode
 */
export const uiToTokenEnforcementMode: Record<UIEnforcementMode, TokenEnforcementMode> = {
  [UIEnforcementMode.Always]: TokenEnforcementMode.Hard,
  [UIEnforcementMode.Soft]: TokenEnforcementMode.Soft,
  [UIEnforcementMode.Never]: TokenEnforcementMode.None
};

/**
 * Mapping from token enforcement mode to UI enforcement mode
 */
export const tokenToUIEnforcementModeEnum: Record<TokenEnforcementMode, UIEnforcementMode> = {
  [TokenEnforcementMode.None]: UIEnforcementMode.Never,
  [TokenEnforcementMode.Warn]: UIEnforcementMode.Soft,
  [TokenEnforcementMode.Soft]: UIEnforcementMode.Soft,
  [TokenEnforcementMode.Hard]: UIEnforcementMode.Always,
  [TokenEnforcementMode.Always]: UIEnforcementMode.Always,
  [TokenEnforcementMode.Never]: UIEnforcementMode.Never,
  [TokenEnforcementMode.RoleBased]: UIEnforcementMode.Soft,
  [TokenEnforcementMode.ModeBased]: UIEnforcementMode.Soft,
  [TokenEnforcementMode.Strict]: UIEnforcementMode.Always
};
