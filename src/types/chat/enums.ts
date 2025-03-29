
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
 * Message roles in conversations
 */
export enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
  Error = 'error',
  Tool = 'tool',
  Function = 'function'
}

/**
 * Message types for different content formats
 */
export enum MessageType {
  Text = 'text',
  Command = 'command',
  System = 'system',
  Image = 'image',
  Training = 'training',
  Code = 'code',
  File = 'file',
  Audio = 'audio',
  Link = 'link'
}

/**
 * Message status indicators
 */
export enum MessageStatus {
  Pending = 'pending',
  Sending = 'sending',
  Sent = 'sent',
  Received = 'received',
  Error = 'error',
  Failed = 'failed',
  Retrying = 'retrying',
  Cached = 'cached',
  Canceled = 'canceled',
  Delivered = 'delivered'
}

/**
 * Token enforcement modes
 */
export enum TokenEnforcementMode {
  None = 'none',        // No enforcement
  Warn = 'warn',        // Show warnings but allow usage
  Soft = 'soft',        // Degrade features when tokens are low
  Hard = 'hard',        // Block operations when tokens are depleted
  Always = 'always',    // Legacy: always enforce
  Never = 'never',      // Legacy: never enforce
  RoleBased = 'role_based', // Enforcement based on user role
  ModeBased = 'mode_based', // Enforcement based on chat mode
  Strict = 'strict'     // Strict enforcement with no exceptions
}

/**
 * UI-friendly token enforcement modes (simplified subset)
 */
export enum UIEnforcementMode {
  Always = 'always',
  Soft = 'soft',
  Never = 'never'
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
  [ChatMode.Planning]: 'planning',
  [ChatMode.Code]: 'code'
};
