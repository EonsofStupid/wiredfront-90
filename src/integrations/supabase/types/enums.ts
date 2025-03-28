
import { MessageType as MessageTypeEnum, ChatMode as ChatModeEnum, TokenEnforcementMode as TokenEnforcementModeEnum } from '@/types/chat/enums';

export type MessageType = keyof typeof MessageTypeEnum | (typeof MessageTypeEnum)[keyof typeof MessageTypeEnum];
export type SettingType = "string" | "number" | "boolean" | "json" | "array";

export interface Enums {
  message_type: MessageType;
  setting_type: SettingType;
}

// Re-export enums with types
export { ChatModeEnum as ChatMode, TokenEnforcementModeEnum as TokenEnforcementMode };
export type { ChatMode, TokenEnforcementMode } from '@/components/chat/types/chat-modes';
