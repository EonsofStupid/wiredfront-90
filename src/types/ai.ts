export type AIMode = "chat" | "code" | "file";
export type AIProvider = "gemini" | "openai" | "anthropic" | "huggingface" | "mistral" | "cohere";

export interface AIProviderConfig {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  apiKeyRequired: boolean;
  models: string[];
  icon: string;
}

export interface AIResponse {
  text: string;
  metadata?: {
    model: string;
    processingTime: number;
    tokens?: number;
  };
}

export interface AISettings {
  provider: AIProvider;
  model: string;
  temperature: number;
  maxTokens: number;
  isEnabled: boolean;
}