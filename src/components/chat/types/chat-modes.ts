
import { 
  ChatMode, 
  TokenEnforcementMode, 
  MessageRole, 
  MessageStatus, 
  MessageType,
  UIEnforcementMode
} from '@/types/chat/enums';

/**
 * Type definitions based on enum values for type safety
 */

// Type guard for ChatMode
export function isChatMode(value: string): value is ChatMode {
  return Object.values(ChatMode).includes(value as ChatMode);
}

// Mapping from UI modes to database modes
export const uiModeToDatabaseMode: Record<string, ChatMode> = {
  'standard': ChatMode.Chat,
  'editor': ChatMode.Dev,
  'image': ChatMode.Image,
  'training': ChatMode.Training,
};

// Mapping from database modes to UI modes
export const databaseModeToUiMode: Record<ChatMode, string> = {
  [ChatMode.Chat]: 'standard',
  [ChatMode.Dev]: 'editor',
  [ChatMode.Image]: 'image',
  [ChatMode.Training]: 'training',
  [ChatMode.Editor]: 'editor', // Alias
};

// Type guard for TokenEnforcementMode
export function isTokenEnforcementMode(value: string): value is TokenEnforcementMode {
  return Object.values(TokenEnforcementMode).includes(value as TokenEnforcementMode);
}

// UI enforcement mode type alias
export type UIEnforcementModeType = 'never' | 'warn' | 'strict';

// Mapping from UI enforcement modes to database enforcement modes
export const uiEnforcementToDatabaseEnforcement: Record<UIEnforcementModeType, TokenEnforcementMode> = {
  'never': TokenEnforcementMode.Never,
  'warn': TokenEnforcementMode.Warn,
  'strict': TokenEnforcementMode.Always,
};

// Mapping from database enforcement modes to UI enforcement modes
export const databaseEnforcementToUiEnforcement: Record<TokenEnforcementMode, UIEnforcementModeType> = {
  [TokenEnforcementMode.Always]: 'strict',
  [TokenEnforcementMode.Never]: 'never',
  [TokenEnforcementMode.RoleBased]: 'warn',
  [TokenEnforcementMode.ModeBased]: 'warn',
  [TokenEnforcementMode.Warn]: 'warn',
  [TokenEnforcementMode.Strict]: 'strict'
};

// Chat position type
export type ChatPositionType = 'bottom-left' | 'bottom-right';

// Chat position coordinates type for when we need x/y positions
export interface ChatPositionCoordinates {
  x: number;
  y: number;
}

// Union type for all possible position types
export type ChatPositionUnion = ChatPositionType | ChatPositionCoordinates;

// Type guard for chat position
export function isChatPosition(value: unknown): value is ChatPositionType {
  return typeof value === 'string' && ['bottom-left', 'bottom-right'].includes(value as string);
}

// Type guard for chat position coordinates
export function isChatPositionCoordinates(value: unknown): value is ChatPositionCoordinates {
  return typeof value === 'object' && value !== null && 'x' in value && 'y' in value;
}

// Re-export enum types for convenience
export type {
  ChatMode,
  TokenEnforcementMode,
  MessageRole,
  MessageStatus,
  MessageType,
  UIEnforcementMode
};
