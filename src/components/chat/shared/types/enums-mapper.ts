
import { ChatMode, TokenEnforcementMode, UIEnforcementMode, TaskType } from '@/types/chat/enums';
import { EnumUtils } from '@/lib/enums/EnumUtils';

/**
 * UI mode representation (used in UI components)
 */
export type UiChatMode = 'standard' | 'editor' | 'image' | 'training' | 'planning' | 'code' | 'document' | 'audio';

/**
 * UI task type representation
 */
export type UiTaskType = 'chat' | 'generation' | 'completion' | 'summarization' | 'coding' | 'translation' | 'analysis';

/**
 * Mapping from UI mode to ChatMode enum
 */
export const uiModeToChatMode: Record<UiChatMode, ChatMode> = {
  'standard': ChatMode.Chat,
  'editor': ChatMode.Dev,
  'image': ChatMode.Image,
  'training': ChatMode.Training,
  'planning': ChatMode.Planning,
  'code': ChatMode.Code,
  'document': ChatMode.Document,
  'audio': ChatMode.Audio
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
  [ChatMode.Code]: 'code',
  [ChatMode.Document]: 'document',
  [ChatMode.Audio]: 'audio'
};

/**
 * Mapping from UI task type to TaskType enum
 */
export const uiTaskTypeToTaskType: Record<UiTaskType, TaskType> = {
  'chat': TaskType.Chat,
  'generation': TaskType.Generation,
  'completion': TaskType.Completion,
  'summarization': TaskType.Summarization,
  'coding': TaskType.CodeGeneration,
  'translation': TaskType.Translation,
  'analysis': TaskType.Analysis
};

/**
 * Mapping from TaskType enum to UI task type
 */
export const taskTypeToUiTaskType: Partial<Record<TaskType, UiTaskType>> = {
  [TaskType.Chat]: 'chat',
  [TaskType.Generation]: 'generation',
  [TaskType.Completion]: 'completion',
  [TaskType.Summarization]: 'summarization',
  [TaskType.CodeGeneration]: 'coding',
  [TaskType.Translation]: 'translation',
  [TaskType.Analysis]: 'analysis',
  [TaskType.Conversation]: 'chat'
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

/**
 * Convert string to ChatMode enum with fallback
 */
export const stringToChatMode = (mode: string): ChatMode => {
  return EnumUtils.stringToChatMode(mode);
};

/**
 * Convert string to TokenEnforcementMode enum with fallback
 */
export const stringToTokenEnforcementMode = (mode: string): TokenEnforcementMode => {
  return EnumUtils.stringToTokenEnforcementMode(mode);
};

/**
 * Convert string to TaskType enum with fallback
 */
export const stringToTaskType = (type: string): TaskType => {
  return EnumUtils.stringToTaskType(type);
};
