
export type MessageType = "text" | "command" | "system" | "image" | "training";
export type SettingType = "string" | "number" | "boolean" | "json" | "array";

export interface Enums {
  message_type: MessageType;
  setting_type: SettingType;
}

export type ChatMode = "chat" | "dev" | "image" | "training";
export type TokenEnforcementMode = "always" | "never" | "role_based" | "mode_based";
