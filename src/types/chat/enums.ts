
/**
 * Chat modes supported by the application
 */
export enum ChatMode {
  Chat = 'chat',
  Dev = 'dev',
  Editor = 'editor', // Alias for Dev
  Image = 'image',
  Training = 'training',
  Planning = 'planning',
  Code = 'code'
}

/**
 * Chat positions for UI display
 */
export enum ChatPosition {
  BottomRight = 'bottom-right',
  BottomLeft = 'bottom-left'
}

/**
 * Token enforcement modes
 */
export enum TokenEnforcementMode {
  Never = 'never',
  Warn = 'warn',
  Soft = 'soft',
  Hard = 'hard',
  Always = 'always',
  RoleBased = 'role_based',
  ModeBased = 'mode_based',
  Strict = 'strict'
}

/**
 * Task types for AI operations
 */
export enum TaskType {
  Chat = 'chat',
  Generation = 'generation',
  Completion = 'completion',
  Summarization = 'summarization',
  Translation = 'translation',
  Analysis = 'analysis',
  Extraction = 'extraction',
  Classification = 'classification',
  Other = 'other'
}

/**
 * Convert database chat mode to UI mode
 */
export const databaseModeToUiMode: Record<ChatMode, string> = {
  [ChatMode.Chat]: 'standard',
  [ChatMode.Dev]: 'editor',
  [ChatMode.Editor]: 'editor',
  [ChatMode.Image]: 'image',
  [ChatMode.Training]: 'training',
  [ChatMode.Planning]: 'standard',
  [ChatMode.Code]: 'editor'
};
