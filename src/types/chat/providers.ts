
import { Json } from '@/integrations/supabase/types';

/**
 * Provider interface - represents a chat service provider (OpenAI, Anthropic, etc)
 */
export interface Provider {
  id: string;
  name: string;
  displayName: string;
  models: ProviderModel[];
  isEnabled: boolean;
  isDefault?: boolean;
  apiKeyName?: string;
  baseUrl?: string;
  category?: string;
  metadata?: Record<string, any>;
}

/**
 * Model supported by a provider
 */
export interface ProviderModel {
  id: string;
  name: string;
  displayName: string;
  maxTokens: number;
  contextWindow: number;
  supportedModes: string[];
  isDefault?: boolean;
  capabilities?: string[];
  metadata?: Record<string, any>;
}

/**
 * Provider settings stored per user
 */
export interface UserProviderSettings {
  id: string;
  userId: string;
  providerId: string;
  isDefault: boolean;
  isEnabled: boolean;
  config: Json;
  createdAt: string;
  updatedAt: string;
}
