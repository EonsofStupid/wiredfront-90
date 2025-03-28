
// Enum mappers to handle transitions between different enum representations
import { ChatMode, ChatPosition, MessageRole, MessageStatus, MessageType } from '@/types/chat/enums';
import { TokenEnforcementMode } from '@/types/chat/tokens';

// Type definition for UI mode
export type UiChatMode = 'standard' | 'editor' | 'image' | 'training';

// Mapping from database mode (ChatMode enum) to UI representation
export const databaseModeToUiMode: Record<ChatMode, UiChatMode> = {
  [ChatMode.Chat]: 'standard',
  [ChatMode.Dev]: 'editor',
  [ChatMode.Editor]: 'editor',
  [ChatMode.Image]: 'image',
  [ChatMode.Training]: 'training',
  // Handle potential future ChatMode enum values
  ...(ChatMode as any).Planning && { [(ChatMode as any).Planning]: 'standard' },
  ...(ChatMode as any).Code && { [(ChatMode as any).Code]: 'editor' }
};

// Mapping from UI mode to database mode (ChatMode enum)
export const uiModeToChatMode: Record<UiChatMode, ChatMode> = {
  'standard': ChatMode.Chat,
  'editor': ChatMode.Dev,
  'image': ChatMode.Image,
  'training': ChatMode.Training
};

// Mapping strings to chat modes
export const stringToChatMode = (mode: string): ChatMode => {
  const lowerMode = mode.trim().toLowerCase();
  
  switch (lowerMode) {
    case 'chat':
    case 'standard':
      return ChatMode.Chat;
    case 'dev':
    case 'developer':
    case 'editor':
      return ChatMode.Dev;
    case 'image':
      return ChatMode.Image;
    case 'training':
      return ChatMode.Training;
    case 'planning':
      // Handle potential future enum value
      return (ChatMode as any).Planning || ChatMode.Chat;
    case 'code':
      // Handle potential future enum value
      return (ChatMode as any).Code || ChatMode.Dev;
    default:
      return ChatMode.Chat;
  }
};

// Mapping from chat position enum to CSS classes
export const positionToClasses: Record<ChatPosition, string> = {
  [ChatPosition.BottomRight]: 'bottom-right',
  [ChatPosition.BottomLeft]: 'bottom-left'
};

// Mapping from message role enum to CSS classes
export const messageRoleToClasses: Record<MessageRole, string> = {
  [MessageRole.User]: 'user',
  [MessageRole.Assistant]: 'assistant',
  [MessageRole.System]: 'system',
  [MessageRole.Error]: 'error',
  [MessageRole.Tool]: 'tool',
  [MessageRole.Function]: 'function'
};

// Mapping from message status enum to user-friendly labels
export const messageStatusToLabel: Record<MessageStatus, string> = {
  [MessageStatus.Pending]: 'Pending',
  [MessageStatus.Sending]: 'Sending...',
  [MessageStatus.Sent]: 'Sent',
  [MessageStatus.Received]: 'Received',
  [MessageStatus.Error]: 'Error',
  [MessageStatus.Canceled]: 'Canceled',
  // Handle potential future MessageStatus enum values
  ...(MessageStatus as any).Delivered && { [(MessageStatus as any).Delivered]: 'Delivered' }
};

// Mapping from message type enum to icon names
export const messageTypeToIcon: Record<MessageType, string> = {
  [MessageType.Text]: 'message-square',
  [MessageType.Code]: 'code',
  [MessageType.Image]: 'image',
  [MessageType.Audio]: 'mic',
  [MessageType.File]: 'file',
  [MessageType.Link]: 'link',
  [MessageType.System]: 'info'
};

// Mapping from token enforcement mode to user-friendly labels
export const tokenEnforcementModeToLabel: Record<TokenEnforcementMode, string> = {
  [TokenEnforcementMode.None]: 'Disabled',
  [TokenEnforcementMode.Warn]: 'Warning Only',
  [TokenEnforcementMode.Soft]: 'Soft Limit',
  [TokenEnforcementMode.Hard]: 'Hard Limit'
};

// UI-friendly mapping for token enforcement modes
export const tokenToUIEnforcementMode: Record<TokenEnforcementMode, {
  label: string;
  description: string;
  color: string;
}> = {
  [TokenEnforcementMode.None]: {
    label: 'Disabled',
    description: 'No token limits enforced',
    color: 'text-gray-500'
  },
  [TokenEnforcementMode.Warn]: {
    label: 'Warning Only',
    description: 'Users are warned when reaching limits',
    color: 'text-yellow-500'
  },
  [TokenEnforcementMode.Soft]: {
    label: 'Soft Limit',
    description: 'Functionality degrades when limits reached',
    color: 'text-orange-500'
  },
  [TokenEnforcementMode.Hard]: {
    label: 'Hard Limit',
    description: 'Features blocked when limits reached',
    color: 'text-red-500'
  }
};
