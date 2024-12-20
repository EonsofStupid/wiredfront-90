import { LucideIcon } from "lucide-react";

export type AIMode = "chat" | "code" | "file";
export type AIProvider = "gemini" | "chatgpt" | "anthropic" | "huggingface" | "mistral" | "cohere";

export interface AIProviderConfig {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  apiKeyRequired: boolean;
  models: string[];
  icon: LucideIcon;
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