
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
  Code = 'code',
  Document = 'document', // Added for document-based interactions
  Audio = 'audio' // Added for audio-based interactions
}

/**
 * Chat positions for UI display
 */
export enum ChatPosition {
  BottomRight = 'bottom-right',
  BottomLeft = 'bottom-left',
  TopRight = 'top-right', // Added for more positioning options
  TopLeft = 'top-left' // Added for more positioning options
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
  Link = 'link',
  Document = 'document' // Added for document content
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
 * These values must match the database representation in user_tokens.enforcement_mode
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
 * Must be aligned with the TaskType in communication.ts
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
  Transformation = 'transformation',
  Recommendation = 'recommendation',
  StructuredOutput = 'structured_output',
  AdminQuery = 'admin_query',
  SystemDiagnostic = 'system_diagnostic',
  CacheQuery = 'cache_query',
  VectorIndex = 'vector_index',
  ModelValidation = 'model_validation',
  QuestionAnswering = 'question_answering',
  ImageGeneration = 'image_generation',
  CodeGeneration = 'code_generation',
  Conversation = 'conversation', // Alias for Chat for backward compatibility
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
  [ChatMode.Code]: 'code',
  [ChatMode.Document]: 'document',
  [ChatMode.Audio]: 'audio'
};
