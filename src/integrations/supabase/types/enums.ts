
import { 
  MessageType as MessageTypeEnum, 
  ChatMode as ChatModeEnum, 
  TokenEnforcementMode as TokenEnforcementModeEnum 
} from '@/types/chat/enums';
import { 
  messageTypeToString,
  chatModeToString,
  safeEnumValue
} from '@/components/chat/types/enums-mapper';

// Re-export the enum values for use in the integration layer
export const MessageType = MessageTypeEnum;
export const ChatMode = ChatModeEnum;
export const TokenEnforcementMode = TokenEnforcementModeEnum;

// Define the SettingType which is not an enum but a union type
export type SettingType = "string" | "number" | "boolean" | "json" | "array";

// Define the Enums interface for database operations
export interface Enums {
  message_type: typeof MessageTypeEnum;
  setting_type: SettingType;
  chat_mode: typeof ChatModeEnum;
  token_enforcement: typeof TokenEnforcementModeEnum;
}

// Helper functions for database operations
export const getDbMessageType = (type: MessageTypeEnum): string => messageTypeToString(type);
export const getDbChatMode = (mode: ChatModeEnum): string => chatModeToString(mode);
export const getDbEnforcementMode = (mode: TokenEnforcementModeEnum): string => safeEnumValue(mode).toString();
