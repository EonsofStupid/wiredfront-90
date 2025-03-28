
import { 
  MessageType as MessageTypeEnum, 
  ChatMode as ChatModeEnum, 
  TokenEnforcementMode as TokenEnforcementModeEnum 
} from '@/types/chat/enums';

// Re-export the enum values for use in the integration layer
export const MessageType = MessageTypeEnum;
export const ChatMode = ChatModeEnum;
export const TokenEnforcementMode = TokenEnforcementModeEnum;

// Define types that are not enums
export type SettingType = "string" | "number" | "boolean" | "json" | "array";

export interface Enums {
  message_type: MessageTypeEnum;
  setting_type: SettingType;
  chat_mode: ChatModeEnum;
  token_enforcement: TokenEnforcementModeEnum;
}
