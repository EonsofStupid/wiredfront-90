/**
 * All chat-related enum types - Source of truth for the application
 */

/**
 * Chat modes supported by the application
 */
export type ChatMode = 'chat' | 'dev' | 'image' | 'training' | 'planning' | 'code';

/**
 * UI-friendly chat mode type
 */
export type UiChatMode = ChatMode | 'settings';

/**
 * Chat positions for UI display
 */
export enum ChatPosition {
  BottomRight = 'bottom-right',
  BottomLeft = 'bottom-left',
  TopRight = 'top-right',
  TopLeft = 'top-left'
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
  Document = 'document'
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
  None = 'none',
  Warn = 'warn',
  Soft = 'soft',
  Hard = 'hard',
  Always = 'always',
  Never = 'never',
  RoleBased = 'role_based',
  ModeBased = 'mode_based',
  Strict = 'strict'
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
  // Core task types
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
  
  // Admin and system task types
  AdminQuery = 'admin_query',
  SystemDiagnostic = 'system_diagnostic',
  CacheQuery = 'cache_query',
  VectorIndex = 'vector_index',
  ModelValidation = 'model_validation',
  
  // Specific AI task types
  QuestionAnswering = 'question_answering',
  ImageGeneration = 'image_generation',
  CodeGeneration = 'code_generation',
  
  // Extended task types for specific applications
  Tutoring = 'tutoring',
  ProblemSolving = 'problem_solving',
  Explanation = 'explanation',
  CodeExplanation = 'code_explanation',
  BugFix = 'bug_fix',
  CodeReview = 'code_review',
  Refactoring = 'refactoring',
  ProjectContext = 'project_context',
  ImageEditing = 'image_editing',
  DocumentSearch = 'document_search',
  
  // Legacy and fallback
  Conversation = 'conversation', // Alias for Chat for backward compatibility
  Other = 'other'
}

/**
 * Mapping from UI mode to ChatMode
 */
export const UiModeToChatMode: Record<UiChatMode, ChatMode> = {
  'chat': 'chat',
  'dev': 'dev',
  'image': 'image',
  'training': 'training',
  'planning': 'planning',
  'code': 'code',
  'settings': 'chat' // Settings defaults to chat mode
};

/**
 * Mapping from ChatMode to UI mode
 */
export const ChatModeToUiMode: Record<ChatMode, UiChatMode> = {
  'chat': 'chat',
  'dev': 'dev',
  'image': 'image',
  'training': 'training',
  'planning': 'planning',
  'code': 'code'
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
export const tokenToUIEnforcementMode: Record<TokenEnforcementMode, UIEnforcementMode> = {
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
 * Utility functions for converting between string and enum values
 */
export const stringToChatMode = (mode: string): ChatMode => {
  if (mode === 'chat' || mode === 'dev' || mode === 'image' || 
      mode === 'training' || mode === 'planning' || mode === 'code') {
    return mode;
  }
  return 'chat'; // Default to chat for unknown modes
};

export const stringToTokenEnforcementMode = (mode: string): TokenEnforcementMode => {
  switch (mode.toLowerCase()) {
    case 'none': return TokenEnforcementMode.None;
    case 'warn': return TokenEnforcementMode.Warn;
    case 'soft': return TokenEnforcementMode.Soft;
    case 'hard': return TokenEnforcementMode.Hard;
    case 'always': return TokenEnforcementMode.Always;
    case 'never': return TokenEnforcementMode.Never;
    case 'role_based': return TokenEnforcementMode.RoleBased;
    case 'mode_based': return TokenEnforcementMode.ModeBased;
    case 'strict': return TokenEnforcementMode.Strict;
    default: return TokenEnforcementMode.Soft;
  }
};

export const stringToTaskType = (type: string): TaskType => {
  switch (type.toLowerCase()) {
    case 'chat': return TaskType.Chat;
    case 'generation': return TaskType.Generation;
    case 'completion': return TaskType.Completion;
    case 'summarization': return TaskType.Summarization;
    case 'translation': return TaskType.Translation;
    case 'analysis': return TaskType.Analysis;
    case 'question_answering': return TaskType.QuestionAnswering;
    case 'image_generation': return TaskType.ImageGeneration;
    case 'code_generation': return TaskType.CodeGeneration;
    case 'conversation': return TaskType.Conversation;
    default: return TaskType.Other;
  }
};

/**
 * Get the icon name for a chat mode
 */
export const getChatModeIcon = (mode: ChatMode): string => {
  switch (mode) {
    case 'chat': return 'message-circle';
    case 'dev': return 'code';
    case 'image': return 'image';
    case 'training': return 'graduation-cap';
    case 'planning': return 'clipboard-list';
    case 'code': return 'terminal';
    default: return 'message-circle';
  }
};

/**
 * Get the display label for a chat mode
 */
export const getChatModeLabel = (mode: ChatMode): string => {
  switch (mode) {
    case 'chat': return 'Chat';
    case 'dev': return 'Developer';
    case 'image': return 'Image';
    case 'training': return 'Training';
    case 'planning': return 'Planning';
    case 'code': return 'Code';
    default: return 'Chat';
  }
};

}
