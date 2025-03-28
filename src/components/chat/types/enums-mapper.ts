
import { 
  MessageType, 
  ChatMode, 
  TokenEnforcementMode, 
  UIEnforcementMode 
} from '@/types/chat/enums';

/**
 * Safely get string value from enum
 */
export function safeEnumValue(value: any): string | number {
  return value !== undefined ? value : '';
}

/**
 * Convert MessageType enum to string for database
 */
export function messageTypeToString(type: MessageType): string {
  switch(type) {
    case MessageType.Text: return 'text';
    case MessageType.Command: return 'command';
    case MessageType.System: return 'system';
    case MessageType.Image: return 'image';
    case MessageType.Training: return 'training';
    case MessageType.Code: return 'code';
    case MessageType.File: return 'file';
    default: return 'text';
  }
}

/**
 * Convert string to MessageType enum
 */
export function stringToMessageType(type: string): MessageType {
  switch(type.toLowerCase()) {
    case 'text': return MessageType.Text;
    case 'command': return MessageType.Command;
    case 'system': return MessageType.System;
    case 'image': return MessageType.Image;
    case 'training': return MessageType.Training;
    case 'code': return MessageType.Code;
    case 'file': return MessageType.File;
    default: return MessageType.Text;
  }
}

/**
 * Convert ChatMode enum to string for database
 */
export function chatModeToString(mode: ChatMode): string {
  switch(mode) {
    case ChatMode.Chat: return 'chat';
    case ChatMode.Dev: return 'dev';
    case ChatMode.Editor: return 'editor';
    case ChatMode.Image: return 'image';
    case ChatMode.Training: return 'training';
    default: return 'chat';
  }
}

/**
 * Convert string to ChatMode enum
 */
export function stringToChatMode(mode: string): ChatMode {
  switch(mode.toLowerCase()) {
    case 'chat': return ChatMode.Chat;
    case 'dev': return ChatMode.Dev;
    case 'editor': return ChatMode.Editor;
    case 'image': return ChatMode.Image;
    case 'training': return ChatMode.Training;
    default: return ChatMode.Chat;
  }
}

/**
 * Convert UIEnforcementMode to TokenEnforcementMode
 */
export function uiToTokenEnforcementMode(mode: UIEnforcementMode): TokenEnforcementMode {
  switch(mode) {
    case UIEnforcementMode.Always: return TokenEnforcementMode.Always;
    case UIEnforcementMode.Never: return TokenEnforcementMode.Never;
    case UIEnforcementMode.Soft: return TokenEnforcementMode.Warn;
    default: return TokenEnforcementMode.Warn;
  }
}

/**
 * Convert TokenEnforcementMode to UIEnforcementMode
 */
export function tokenToUIEnforcementMode(mode: TokenEnforcementMode): UIEnforcementMode {
  switch(mode) {
    case TokenEnforcementMode.Always: return UIEnforcementMode.Always;
    case TokenEnforcementMode.Never: return UIEnforcementMode.Never;
    case TokenEnforcementMode.Warn: 
    case TokenEnforcementMode.RoleBased:
    case TokenEnforcementMode.ModeBased:
    case TokenEnforcementMode.Strict:
      return UIEnforcementMode.Soft;
    default: return UIEnforcementMode.Soft;
  }
}
