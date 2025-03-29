
/**
 * Core enum types for the application
 * This file serves as the single source of truth for all enum types
 */

/**
 * Chat mode enum - defines the different modes of operation for the chat
 */
export enum ChatMode {
  Chat = 'chat',
  Dev = 'dev',
  Editor = 'editor',
  Image = 'image',
  Training = 'training',
  Planning = 'planning',
  Code = 'code',
  Document = 'document',
  Audio = 'audio'
}

/**
 * Message role enum - defines the sender role for messages
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
 * Message type enum - defines the content type of messages
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
 * Message status enum - defines the delivery status of messages
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
 * Task type enum - defines the different types of tasks
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
  Conversation = 'conversation',
  Other = 'other'
}

/**
 * Token enforcement mode enum - defines how token limits are enforced
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
 * UI enforcement mode enum - defines how UI limits are enforced
 */
export enum UIEnforcementMode {
  Always = 'always',
  Soft = 'soft',
  Never = 'never'
}

/**
 * Chat position enum - defines where the chat UI is positioned
 */
export enum ChatPosition {
  BottomRight = 'bottom-right',
  BottomLeft = 'bottom-left',
  TopRight = 'top-right',
  TopLeft = 'top-left'
}

/**
 * Helper function to get an icon name for a chat mode
 */
export function getChatModeIcon(mode: ChatMode | string): string {
  // Convert string to ChatMode if needed
  const chatMode = typeof mode === 'string' 
    ? stringToChatMode(mode) 
    : mode;
  
  switch (chatMode) {
    case ChatMode.Chat: return 'message-square';
    case ChatMode.Dev:
    case ChatMode.Editor: return 'code';
    case ChatMode.Image: return 'image';
    case ChatMode.Training: return 'book-open';
    case ChatMode.Planning: return 'clipboard-list';
    case ChatMode.Code: return 'terminal';
    case ChatMode.Document: return 'file-text';
    case ChatMode.Audio: return 'mic';
    default: return 'message-square';
  }
}

/**
 * Helper function to convert string to ChatMode
 */
export function stringToChatMode(mode: string): ChatMode {
  if (!mode) return ChatMode.Chat;
  
  switch (mode.toLowerCase()) {
    case 'chat': return ChatMode.Chat;
    case 'dev': 
    case 'editor': return ChatMode.Dev;
    case 'image': return ChatMode.Image;
    case 'training': return ChatMode.Training;
    case 'planning': return ChatMode.Planning;
    case 'code': return ChatMode.Code;
    case 'document': return ChatMode.Document;
    case 'audio': return ChatMode.Audio;
    default: return ChatMode.Chat;
  }
}

/**
 * Helper function to get a human-readable label for a chat mode
 */
export function getChatModeLabel(mode: ChatMode): string {
  switch (mode) {
    case ChatMode.Chat: return 'Chat';
    case ChatMode.Dev:
    case ChatMode.Editor: return 'Editor';
    case ChatMode.Image: return 'Image Generation';
    case ChatMode.Training: return 'Training';
    case ChatMode.Planning: return 'Planning';
    case ChatMode.Code: return 'Code Assistant';
    case ChatMode.Document: return 'Document';
    case ChatMode.Audio: return 'Audio';
    default: return 'Chat';
  }
}
