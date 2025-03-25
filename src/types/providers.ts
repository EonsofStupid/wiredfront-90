export type ProviderCategory =
  | "ai"
  | "vector"
  | "voice"
  | "storage"
  | "development";

export type ChatProviderType =
  | "openai"
  | "anthropic"
  | "gemini"
  | "huggingface"
  | "ollama"
  | "local";

export type AIProviderType = "chat" | "embeddings" | "both";

export interface Provider {
  id: string;
  name: string;
  description?: string;
  isEnabled: boolean;
  defaultModel?: string;
  availableModels?: string[];
  configSchema: any;
  baseUrl?: string;
  createdAt: string;
  updatedAt: string;
  category: ProviderCategory;
  type: ChatProviderType;
}
