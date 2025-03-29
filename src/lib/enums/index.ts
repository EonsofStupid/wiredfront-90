
import { 
  ChatMode, 
  ChatPosition, 
  TokenEnforcementMode, 
  MessageRole, 
  MessageType,
  MessageStatus,
  TaskType,
  UIEnforcementMode
} from '@/types/chat/enums';

// UiChatMode type definition for UI presentation
export type UiChatMode = 'chat' | 'dev' | 'image' | 'training' | 'planning' | 'code' | 'editor' | 'document' | 'audio';

/**
 * Utility class for handling enums
 */
export const EnumUtils = {
  // ChatMode conversions
  stringToChatMode: (mode: string | ChatMode): ChatMode => {
    if (typeof mode !== 'string') return mode;
    
    switch (mode.toLowerCase()) {
      case 'chat': return ChatMode.Chat;
      case 'dev': return ChatMode.Dev;
      case 'editor': return ChatMode.Editor;
      case 'image': return ChatMode.Image;
      case 'training': return ChatMode.Training;
      case 'planning': return ChatMode.Planning;
      case 'code': return ChatMode.Code;
      case 'document': return ChatMode.Document;
      case 'audio': return ChatMode.Audio;
      default: return ChatMode.Chat;
    }
  },
  
  chatModeToString: (mode: ChatMode): string => {
    switch (mode) {
      case ChatMode.Chat: return 'chat';
      case ChatMode.Dev: return 'dev';
      case ChatMode.Editor: return 'editor';
      case ChatMode.Image: return 'image';
      case ChatMode.Training: return 'training';
      case ChatMode.Planning: return 'planning';
      case ChatMode.Code: return 'code';
      case ChatMode.Document: return 'document';
      case ChatMode.Audio: return 'audio';
      default: return 'chat';
    }
  },
  
  chatModeToUiMode: (mode: ChatMode): UiChatMode => {
    return EnumUtils.chatModeToString(mode) as UiChatMode;
  },
  
  // Database conversions
  chatModeForDatabase: (mode: ChatMode): string => {
    return EnumUtils.chatModeToString(mode);
  },
  
  databaseStringToChatMode: (mode: string): ChatMode => {
    return EnumUtils.stringToChatMode(mode);
  },
  
  // Chat position conversions
  stringToChatPosition: (position: string | ChatPosition): ChatPosition => {
    if (typeof position !== 'string') return position;
    
    switch (position.toLowerCase()) {
      case 'bottom-right': return ChatPosition.BottomRight;
      case 'bottom-left': return ChatPosition.BottomLeft;
      case 'top-right': return ChatPosition.TopRight;
      case 'top-left': return ChatPosition.TopLeft;
      case 'docked': return ChatPosition.Docked;
      default: return ChatPosition.BottomRight;
    }
  },
  
  // Token enforcement mode conversions
  stringToTokenEnforcementMode: (mode: string | TokenEnforcementMode): TokenEnforcementMode => {
    if (typeof mode !== 'string') return mode;
    
    switch (mode.toLowerCase()) {
      case 'none': return TokenEnforcementMode.None;
      case 'warn': return TokenEnforcementMode.Warn;
      case 'block': return TokenEnforcementMode.Block;
      default: return TokenEnforcementMode.None;
    }
  },
  
  // UI enforcement mode conversions
  stringToUIEnforcementMode: (mode: string | UIEnforcementMode): UIEnforcementMode => {
    if (typeof mode !== 'string') return mode;
    
    switch (mode.toLowerCase()) {
      case 'none': return UIEnforcementMode.None;
      case 'warn': return UIEnforcementMode.Warn;
      case 'block': return UIEnforcementMode.Block;
      default: return UIEnforcementMode.None;
    }
  },
  
  // Message role conversions
  stringToMessageRole: (role: string | MessageRole): MessageRole => {
    if (typeof role !== 'string') return role;
    
    switch (role.toLowerCase()) {
      case 'user': return MessageRole.User;
      case 'assistant': return MessageRole.Assistant;
      case 'system': return MessageRole.System;
      case 'function': return MessageRole.Function;
      case 'tool': return MessageRole.Tool;
      default: return MessageRole.User;
    }
  },
  
  // Message type conversions
  stringToMessageType: (type: string | MessageType): MessageType => {
    if (typeof type !== 'string') return type;
    
    switch (type.toLowerCase()) {
      case 'text': return MessageType.Text;
      case 'image': return MessageType.Image;
      case 'code': return MessageType.Code;
      case 'error': return MessageType.Error;
      case 'system': return MessageType.System;
      case 'tool': return MessageType.Tool;
      default: return MessageType.Text;
    }
  },
  
  // Message status conversions
  stringToMessageStatus: (status: string | MessageStatus): MessageStatus => {
    if (typeof status !== 'string') return status;
    
    switch (status.toLowerCase()) {
      case 'sending': return MessageStatus.Sending;
      case 'sent': return MessageStatus.Sent;
      case 'delivered': return MessageStatus.Delivered;
      case 'error': return MessageStatus.Error;
      default: return MessageStatus.Sending;
    }
  },
  
  // Task type conversions
  stringToTaskType: (task: string | TaskType): TaskType => {
    if (typeof task !== 'string') return task;
    
    switch (task.toLowerCase()) {
      case 'fetch': return TaskType.Fetch;
      case 'query': return TaskType.Query;
      case 'generation': return TaskType.Generation;
      case 'code': return TaskType.Code;
      case 'system': return TaskType.System;
      default: return TaskType.System;
    }
  },
  
  // UI labels
  getChatModeLabel: (mode: ChatMode): string => {
    switch (mode) {
      case ChatMode.Chat: return 'Chat';
      case ChatMode.Dev: return 'Developer';
      case ChatMode.Editor: return 'Editor';
      case ChatMode.Image: return 'Image';
      case ChatMode.Training: return 'Training';
      case ChatMode.Planning: return 'Planning';
      case ChatMode.Code: return 'Code';
      case ChatMode.Document: return 'Document';
      case ChatMode.Audio: return 'Audio';
      default: return 'Chat';
    }
  },
  
  getMessageRoleLabel: (role: MessageRole): string => {
    switch (role) {
      case MessageRole.User: return 'User';
      case MessageRole.Assistant: return 'Assistant';
      case MessageRole.System: return 'System';
      case MessageRole.Function: return 'Function';
      case MessageRole.Tool: return 'Tool';
      default: return 'User';
    }
  },
  
  getMessageTypeLabel: (type: MessageType): string => {
    switch (type) {
      case MessageType.Text: return 'Text';
      case MessageType.Image: return 'Image';
      case MessageType.Code: return 'Code';
      case MessageType.Error: return 'Error';
      case MessageType.System: return 'System';
      case MessageType.Tool: return 'Tool';
      default: return 'Text';
    }
  },
  
  getChatModeIcon: (mode: ChatMode): string => {
    switch (mode) {
      case ChatMode.Chat: return 'message-circle';
      case ChatMode.Dev: return 'code';
      case ChatMode.Editor: return 'edit';
      case ChatMode.Image: return 'image';
      case ChatMode.Training: return 'graduation-cap';
      case ChatMode.Planning: return 'clipboard-list';
      case ChatMode.Code: return 'terminal';
      case ChatMode.Document: return 'file-text';
      case ChatMode.Audio: return 'headphones';
      default: return 'message-circle';
    }
  }
};

export default EnumUtils;
