
/**
 * Enums for the chat system
 * These are proper enums that exist at runtime (rather than just types)
 */

// Message role types
export enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
  System = 'system'
}

// Message types
export enum MessageType {
  Text = 'text',
  Command = 'command',
  System = 'system',
  Image = 'image',
  Training = 'training',
  Code = 'code',
  File = 'file'
}

// Message status
export enum MessageStatus {
  Pending = 'pending',
  Sent = 'sent',
  Received = 'received',
  Error = 'error',
  Failed = 'failed',
  Retrying = 'retrying',
  Cached = 'cached'
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

// Token enforcement modes
export enum TokenEnforcementMode {
  Always = 'always',
  Never = 'never',
  RoleBased = 'role_based',
  ModeBased = 'mode_based',
  Warn = 'warn',
  Strict = 'strict'
}

// Chat mode
export enum ChatMode {
  Chat = 'chat',
  Dev = 'dev',
  Image = 'image',
  Training = 'training',
  Editor = 'editor' // Alias for 'dev'
}

// Create constant objects for use in type assertions
export const MessageRoles = {
  User: MessageRole.User,
  Assistant: MessageRole.Assistant,
  System: MessageRole.System
} as const;

export const MessageTypes = {
  Text: MessageType.Text,
  Command: MessageType.Command,
  System: MessageType.System,
  Image: MessageType.Image,
  Training: MessageType.Training,
  Code: MessageType.Code,
  File: MessageType.File
} as const;

export const MessageStatuses = {
  Pending: MessageStatus.Pending,
  Sent: MessageStatus.Sent,
  Received: MessageStatus.Received,
  Error: MessageStatus.Error,
  Failed: MessageStatus.Failed,
  Retrying: MessageStatus.Retrying,
  Cached: MessageStatus.Cached
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
  Always: TokenEnforcementMode.Always,
  Never: TokenEnforcementMode.Never,
  RoleBased: TokenEnforcementMode.RoleBased,
  ModeBased: TokenEnforcementMode.ModeBased,
  Warn: TokenEnforcementMode.Warn,
  Strict: TokenEnforcementMode.Strict
} as const;

export const ChatModes = {
  Chat: ChatMode.Chat,
  Dev: ChatMode.Dev,
  Image: ChatMode.Image,
  Training: ChatMode.Training,
  Editor: ChatMode.Editor
} as const;
