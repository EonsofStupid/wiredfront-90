
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
  Training = 'training'
}

// Message status
export enum MessageStatus {
  Pending = 'pending',
  Sent = 'sent',
  Received = 'received',
  Error = 'error',
  Retrying = 'retrying'
}

// Chat position types
export enum ChatPosition {
  BottomRight = 'bottom-right',
  BottomLeft = 'bottom-left',
  Custom = 'custom'
}

// Chat position coordinates
export type ChatPositionCoordinates = {
  x: number;
  y: number;
}

// Token enforcement modes
export enum TokenEnforcementMode {
  Always = 'always',
  Soft = 'soft',
  Never = 'never'
}

// UI enforcement modes (used in UI components)
export enum UIEnforcementMode {
  Always = 'always',
  Soft = 'soft',
  Never = 'never'
}

// Re-export these from our central location
export { ChatMode } from '@/components/chat/types/chat-modes';
