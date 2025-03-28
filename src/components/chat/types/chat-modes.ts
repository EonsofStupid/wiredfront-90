
import { 
  ChatMode, 
  TokenEnforcementMode, 
  MessageRole, 
  MessageStatus, 
  MessageType,
  UIEnforcementMode,
  ChatPosition
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
export type UIEnforcementModeType = UIEnforcementMode.Never | UIEnforcementMode.Soft | UIEnforcementMode.Always;

// Mapping from UI enforcement modes to database enforcement modes
export const uiEnforcementToDatabaseEnforcement: Record<UIEnforcementMode, TokenEnforcementMode> = {
  [UIEnforcementMode.Never]: TokenEnforcementMode.Never,
  [UIEnforcementMode.Soft]: TokenEnforcementMode.Warn,
  [UIEnforcementMode.Always]: TokenEnforcementMode.Always,
};

// Mapping from database enforcement modes to UI enforcement modes
export const databaseEnforcementToUiEnforcement: Record<TokenEnforcementMode, UIEnforcementMode> = {
  [TokenEnforcementMode.Always]: UIEnforcementMode.Always,
  [TokenEnforcementMode.Never]: UIEnforcementMode.Never,
  [TokenEnforcementMode.RoleBased]: UIEnforcementMode.Soft,
  [TokenEnforcementMode.ModeBased]: UIEnforcementMode.Soft,
  [TokenEnforcementMode.Warn]: UIEnforcementMode.Soft,
  [TokenEnforcementMode.Strict]: UIEnforcementMode.Always
};

// Chat position type
export type ChatPositionType = ChatPosition.BottomLeft | ChatPosition.BottomRight;

// Chat position coordinates type for when we need x/y positions
export interface ChatPositionCoordinates {
  x: number;
  y: number;
}

// Union type for all possible position types
export type ChatPositionUnion = ChatPositionType | ChatPositionCoordinates;

// Type guard for chat position
export function isChatPosition(value: unknown): value is ChatPositionType {
  return typeof value === 'string' && Object.values(ChatPosition).includes(value as ChatPosition);
}

// Type guard for chat position coordinates
export function isChatPositionCoordinates(value: unknown): value is ChatPositionCoordinates {
  return typeof value === 'object' && value !== null && 'x' in value && 'y' in value;
}

// Re-export the enums for convenience
export { 
  ChatMode, 
  TokenEnforcementMode, 
  MessageRole, 
  MessageStatus, 
  MessageType, 
  UIEnforcementMode,
  ChatPosition
};
