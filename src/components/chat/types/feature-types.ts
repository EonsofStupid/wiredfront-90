
/**
 * Feature-related types for the chat system
 */

// Define feature action keys
export type FeatureKey = string;

// Core feature flags that can be toggled
export interface FeatureFlags {
  voice: boolean;
  rag: boolean;
  modeSwitch: boolean;
  notifications: boolean;
  github: boolean;
  codeAssistant: boolean;
  ragSupport: boolean;
  githubSync: boolean;
  knowledgeBase: boolean;
  tokenEnforcement: boolean;
  [key: string]: boolean;
}

// Feature toggle history structure
export interface FeatureToggleEvent {
  id: string;
  featureName: FeatureKey;
  userId: string;
  oldValue: boolean | null;
  newValue: boolean;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Feature status types
export type FeatureStatus = 'enabled' | 'disabled' | 'partial' | 'unknown';

// Feature category types
export interface FeatureCategory {
  id: string;
  name: string;
  description?: string;
}
