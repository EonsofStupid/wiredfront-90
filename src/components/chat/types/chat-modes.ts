
import { ChatMode as ChatModeEnum, MessageRole as MessageRoleEnum, MessageStatus as MessageStatusEnum, MessageType as MessageTypeEnum, TokenEnforcementMode as TokenEnforcementModeEnum, UIEnforcementMode as UIEnforcementModeEnum } from '@/types/chat/enums';

/**
 * Type definitions from enum values for type safety
 */

// ChatMode type based on enum
export type ChatMode = keyof typeof ChatModeEnum | (typeof ChatModeEnum)[keyof typeof ChatModeEnum];

// Type guard for ChatMode
export function isChatMode(value: string): value is ChatMode {
  return Object.values(ChatModeEnum).includes(value as any);
}

// Mapping from UI modes to database modes
export const uiModeToDatabaseMode: Record<string, ChatMode> = {
  'standard': ChatModeEnum.Chat,
  'editor': ChatModeEnum.Dev,
  'image': ChatModeEnum.Image,
  'training': ChatModeEnum.Training,
};

// Mapping from database modes to UI modes
export const databaseModeToUiMode: Record<ChatMode, string> = {
  [ChatModeEnum.Chat]: 'standard',
  [ChatModeEnum.Dev]: 'editor',
  [ChatModeEnum.Image]: 'image',
  [ChatModeEnum.Training]: 'training',
  [ChatModeEnum.Editor]: 'editor', // Alias
};

// TokenEnforcementMode type
export type TokenEnforcementMode = keyof typeof TokenEnforcementModeEnum | (typeof TokenEnforcementModeEnum)[keyof typeof TokenEnforcementModeEnum];

// Type guard for TokenEnforcementMode
export function isTokenEnforcementMode(value: string): value is TokenEnforcementMode {
  return Object.values(TokenEnforcementModeEnum).includes(value as any);
}

// UI enforcement mode type
export type UIEnforcementMode = 'never' | 'warn' | 'strict';

// Mapping from UI enforcement modes to database enforcement modes
export const uiEnforcementToDatabaseEnforcement: Record<UIEnforcementMode, TokenEnforcementMode> = {
  'never': TokenEnforcementModeEnum.Never,
  'warn': TokenEnforcementModeEnum.Warn,
  'strict': TokenEnforcementModeEnum.Always,
};

// Mapping from database enforcement modes to UI enforcement modes
export const databaseEnforcementToUiEnforcement: Record<TokenEnforcementMode, UIEnforcementMode> = {
  [TokenEnforcementModeEnum.Always]: 'strict',
  [TokenEnforcementModeEnum.Never]: 'never',
  [TokenEnforcementModeEnum.RoleBased]: 'warn',
  [TokenEnforcementModeEnum.ModeBased]: 'warn',
  [TokenEnforcementModeEnum.Warn]: 'warn',
  [TokenEnforcementModeEnum.Strict]: 'strict'
};

// Chat position type
export type ChatPosition = 'bottom-left' | 'bottom-right';

// Chat position coordinates type for when we need x/y positions
export interface ChatPositionCoordinates {
  x: number;
  y: number;
}

// Union type for all possible position types
export type ChatPositionType = ChatPosition | ChatPositionCoordinates;

// Type guard for chat position
export function isChatPosition(value: unknown): value is ChatPosition {
  return typeof value === 'string' && ['bottom-left', 'bottom-right'].includes(value as string);
}

// Type guard for chat position coordinates
export function isChatPositionCoordinates(value: unknown): value is ChatPositionCoordinates {
  return typeof value === 'object' && value !== null && 'x' in value && 'y' in value;
}

// Message role type
export type MessageRole = keyof typeof MessageRoleEnum | (typeof MessageRoleEnum)[keyof typeof MessageRoleEnum];

// Message type
export type MessageType = keyof typeof MessageTypeEnum | (typeof MessageTypeEnum)[keyof typeof MessageTypeEnum];

// Message status type
export type MessageStatus = keyof typeof MessageStatusEnum | (typeof MessageStatusEnum)[keyof typeof MessageStatusEnum];
