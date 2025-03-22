/**
 * Mode-specific type definitions for the chat system
 */

// Chat modes
export type ChatMode = "dev" | "image" | "training" | "chat";

// Default Chat modes array for validation
export const CHAT_MODES: ChatMode[] = ["dev", "image", "training", "chat"];

/**
 * Type guard to check if a value is a valid ChatMode
 */
export function isChatMode(mode: unknown): mode is ChatMode {
  return typeof mode === "string" && CHAT_MODES.includes(mode as ChatMode);
}

/**
 * Normalize a potentially invalid chat mode to a valid one
 */
export function normalizeChatMode(mode: string): ChatMode {
  switch (mode.toLowerCase()) {
    case "dev":
    case "development":
      return "dev";
    case "img":
    case "image":
      return "image";
    case "train":
    case "training":
      return "training";
    default:
      return "chat";
  }
}

// Mode labels for display
export const MODE_LABELS: Record<ChatMode, string> = {
  dev: "Development",
  image: "Image Generation",
  training: "Training",
  chat: "Chat",
};

// Mode descriptions
export const MODE_DESCRIPTIONS: Record<ChatMode, string> = {
  dev: "AI-assisted development mode",
  image: "Generate and edit images",
  training: "Train and fine-tune models",
  chat: "General chat conversation",
};
