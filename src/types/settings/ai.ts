export type AIProvider = "gemini" | "chatgpt" | "huggingface" | "anthropic" | "mistral" | "cohere";

export interface AISettingsData {
  id?: string;
  user_id: string;
  provider: AIProvider;
  api_key: string | null;
  model_name: string | null;
  max_tokens: number | null;
  temperature: number | null;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}