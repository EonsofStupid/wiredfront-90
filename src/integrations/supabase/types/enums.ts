
export type MessageType = "text" | "command" | "system" | "image" | "training";
export type SettingType = "string" | "number" | "boolean" | "json" | "array";

// Update ChatMode to match exactly what the database expects
export type ChatMode = "chat" | "image" | "dev" | "training" | "planning" | "code";
export type TokenEnforcementMode = "always" | "never" | "role_based" | "mode_based";
