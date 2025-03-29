
/**
 * Enums for the chat system
 * These are proper TypeScript enums that exist at runtime
 */

// Message role types
export enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
  Error = 'error',
  Tool = 'tool',
  Function = 'function'
}

// Message types
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

// Message status
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

// Chat position types
export enum ChatPosition {
  BottomRight = 'bottom-right',
  BottomLeft = 'bottom-left',
  Custom = 'custom'
}

// UI enforcement modes
export enum UIEnforcementMode {
  Always = 'always',
  Soft = 'soft',
  Never = 'never'
}

// Token enforcement modes (database values)
export enum TokenEnforcementMode {
  None = 'none',     // No enforcement
  Warn = 'warn',     // Warn user but allow operations
  Soft = 'soft',     // Degrade functionality but allow some operations
  Hard = 'hard',     // Strictly enforce limits and block operations
  
  // Legacy values for backward compatibility
  Always = 'always',
  Never = 'never',
  RoleBased = 'role_based',
  ModeBased = 'mode_based',
  Strict = 'strict'
}

// Chat mode
export enum ChatMode {
  Chat = 'chat',
  Dev = 'dev',
  Image = 'image',
  Training = 'training',
  Editor = 'editor', // Alias for 'dev'
  Planning = 'planning',
  Code = 'code'
}

// Type constants for use in type assertions
export const MessageRoles = {
  User: MessageRole.User,
  Assistant: MessageRole.Assistant,
  System: MessageRole.System,
  Error: MessageRole.Error,
  Tool: MessageRole.Tool,
  Function: MessageRole.Function
} as const;

export const MessageTypes = {
  Text: MessageType.Text,
  Command: MessageType.Command,
  System: MessageType.System,
  Image: MessageType.Image,
  Training: MessageType.Training,
  Code: MessageType.Code,
  File: MessageType.File,
  Audio: MessageType.Audio,
  Link: MessageType.Link
} as const;

export const MessageStatuses = {
  Pending: MessageStatus.Pending,
  Sending: MessageStatus.Sending,
  Sent: MessageStatus.Sent,
  Received: MessageStatus.Received,
  Error: MessageStatus.Error,
  Failed: MessageStatus.Failed,
  Retrying: MessageStatus.Retrying,
  Cached: MessageStatus.Cached,
  Canceled: MessageStatus.Canceled,
  Delivered: MessageStatus.Delivered
} as const;

export const ChatPositions = {
  BottomRight: ChatPosition.BottomRight,
  BottomLeft: ChatPosition.BottomLeft,
  Custom: ChatPosition.Custom
} as const;

export const UIEnforcementModes = {
  Always: UIEnforcementMode.Always,
  Soft: UIEnforcementMode.Soft,
  Never: UIEnforcementMode.Never
} as const;

export const TokenEnforcementModes = {
  None: TokenEnforcementMode.None,
  Warn: TokenEnforcementMode.Warn,
  Soft: TokenEnforcementMode.Soft,
  Hard: TokenEnforcementMode.Hard,
  Always: TokenEnforcementMode.Always,
  Never: TokenEnforcementMode.Never,
  RoleBased: TokenEnforcementMode.RoleBased,
  ModeBased: TokenEnforcementMode.ModeBased,
  Strict: TokenEnforcementMode.Strict
} as const;

export const ChatModes = {
  Chat: ChatMode.Chat,
  Dev: ChatMode.Dev,
  Image: ChatMode.Image,
  Training: ChatMode.Training,
  Editor: ChatMode.Editor,
  Planning: ChatMode.Planning,
  Code: ChatMode.Code
} as const;

// UI mode to database mode mappings
export const uiModeToDatabaseMode: Record<string, ChatMode> = {
  'standard': ChatMode.Chat,
  'editor': ChatMode.Dev,
  'image': ChatMode.Image,
  'training': ChatMode.Training,
  'planning': ChatMode.Planning,
  'code': ChatMode.Code
};

// Database mode to UI mode mappings
export const databaseModeToUiMode: Record<ChatMode, string> = {
  [ChatMode.Chat]: 'standard',
  [ChatMode.Dev]: 'editor',
  [ChatMode.Editor]: 'editor',
  [ChatMode.Image]: 'image',
  [ChatMode.Training]: 'training',
  [ChatMode.Planning]: 'planning',
  [ChatMode.Code]: 'code'
};
