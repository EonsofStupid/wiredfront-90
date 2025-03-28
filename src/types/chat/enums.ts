
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
