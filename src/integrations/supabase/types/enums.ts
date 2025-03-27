
export type MessageType = "text" | "command" | "system" | "image" | "training";
export type SettingType = "string" | "number" | "boolean" | "json" | "array";

export interface Enums {
  message_type: MessageType;
  setting_type: SettingType;
}

export type { ChatMode, TokenEnforcementMode } from '@/types/chat/enums';
