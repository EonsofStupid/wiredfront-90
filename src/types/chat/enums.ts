
/**
 * Enums for the chat system
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

// Re-export ChatMode from our central location
export { ChatMode, TokenEnforcementMode } from '@/components/chat/types/chat-modes';
