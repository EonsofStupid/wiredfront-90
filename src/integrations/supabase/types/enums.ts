
export type MessageType = "text" | "command" | "system" | "image" | "training";
export type SettingType = "string" | "number" | "boolean" | "json" | "array";

export interface Enums {
  message_type: MessageType;
  setting_type: SettingType;
}

// Consistent ChatMode enum with all supported modes
export type ChatMode = "chat" | "dev" | "image" | "training" | "code" | "editor" | "chat-only";
export type TokenEnforcementMode = "always" | "never" | "role_based" | "mode_based";
