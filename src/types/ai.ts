export type AIMode = "chat" | "code" | "file";
export type AIProvider = "gemini" | "openai" | "anthropic" | "huggingface";

export interface AIResponse {
  text: string;
  metadata?: {
    model: string;
    processingTime: number;
    tokens?: number;
  };
}