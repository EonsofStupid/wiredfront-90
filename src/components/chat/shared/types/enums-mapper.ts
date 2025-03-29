
import { ChatMode, TokenEnforcementMode, UIEnforcementMode } from '@/types/chat/enums';
import { tokenEnforcementModeInfo } from '@/utils/token-utils';

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
 * Reusing the definitions from token-utils.ts
 */
export const tokenToUIEnforcementMode = tokenEnforcementModeInfo;

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
