
import { BaseConfiguration, ProviderSettings } from '../common';
import { APIType } from "@/integrations/supabase/types";

export interface AIProviderSettings extends ProviderSettings {
  model_preferences?: {
    default_model: string;
    temperature: number;
    max_tokens: number;
  };
  training_enabled?: boolean;
  assistant_id?: string;
  assistant_name?: string;
}

export interface AIConfiguration extends BaseConfiguration {
  api_type: Extract<APIType, 'openai' | 'anthropic' | 'gemini' | 'huggingface' | 'openrouter' | 'replicate' | 'sonnet'>;
  provider_settings: AIProviderSettings;
}
