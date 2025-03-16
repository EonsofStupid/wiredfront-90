
import { Database } from '@/integrations/supabase/types';

// Define known feature flags for the application 
export enum KnownFeatureFlag {
  DEV_MODE = 'dev_mode',
  CHAT_GPT4 = 'chat_gpt4',
  ADVANCED_RAG = 'advanced_rag',
  VOICE_COMMANDS = 'voice_commands',
  GITHUB_SYNC = 'github_sync',
  IMAGE_GENERATION = 'image_generation',
  TOKEN_CONTROL = 'token_control'
}

// Feature flag definitions with metadata
export const featureFlags = {
  [KnownFeatureFlag.DEV_MODE]: {
    name: 'Developer Mode',
    description: 'Enable advanced developer features'
  },
  [KnownFeatureFlag.CHAT_GPT4]: {
    name: 'GPT-4 Chat',
    description: 'Enable GPT-4 model for chat interactions'
  },
  [KnownFeatureFlag.ADVANCED_RAG]: {
    name: 'Advanced RAG',
    description: 'Enable advanced retrieval-augmented generation features'
  },
  [KnownFeatureFlag.VOICE_COMMANDS]: {
    name: 'Voice Commands',
    description: 'Enable voice command input for interactions'
  },
  [KnownFeatureFlag.GITHUB_SYNC]: {
    name: 'GitHub Sync',
    description: 'Enable automatic GitHub repository synchronization'
  },
  [KnownFeatureFlag.IMAGE_GENERATION]: {
    name: 'Image Generation',
    description: 'Enable AI image generation capabilities'
  },
  [KnownFeatureFlag.TOKEN_CONTROL]: {
    name: 'Token Control System',
    description: 'Enable the token economy and usage limits'
  }
};

// Type for app_role from the database
export type AppRole = Database["public"]["Enums"]["app_role"];

// Base feature flag interface matching database schema
export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string | null;
  enabled: boolean;
  target_roles: AppRole[] | null;
  rollout_percentage: number;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  metadata?: Record<string, any> | null;
}

// Form values for creating/updating feature flags
export interface FeatureFlagFormValues {
  key: string;
  name: string;
  description?: string;
  enabled: boolean;
  target_roles?: AppRole[];
  rollout_percentage: number;
}

// Export the KnownFeatureFlag enum and featureFlags definitions
export { KnownFeatureFlag, featureFlags };
