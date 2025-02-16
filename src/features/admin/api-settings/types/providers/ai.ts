
import { BaseConfiguration, ProviderSettings } from '../common';
import { APIType } from "@/integrations/supabase/types";

export interface AIModelPreferences {
  default_model: string;
  allowed_models: string[];
  temperature: number;
  max_tokens: number;
}

export interface AIProviderSettings extends ProviderSettings {
  model_preferences?: AIModelPreferences;
  assistant_name?: string;
  training_enabled?: boolean;
}

export interface AIConfiguration extends BaseConfiguration {
  api_type: Extract<APIType, 'openai' | 'anthropic' | 'gemini' | 'huggingface'>;
  provider_settings: AIProviderSettings;
}
