export type MessageType = "text" | "command" | "system";
export type SettingType = "string" | "number" | "boolean" | "json" | "array";

export interface Enums {
  message_type: MessageType;
  setting_type: SettingType;
}