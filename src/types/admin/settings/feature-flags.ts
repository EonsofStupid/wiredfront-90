
// Define all available feature flags for the application
export type KnownFeatureFlag = 
  | 'voice'
  | 'rag'
  | 'modeSwitch'
  | 'notifications'
  | 'github'
  | 'codeAssistant'
  | 'ragSupport'
  | 'githubSync'
  | 'tokenEnforcement';

export interface FeatureFlagDefinition {
  id: KnownFeatureFlag;
  name: string;
  description: string;
  defaultValue: boolean;
  category: 'core' | 'experimental' | 'premium';
  dependencies?: KnownFeatureFlag[];
  conflicts?: KnownFeatureFlag[];
}

export const featureFlags: Record<KnownFeatureFlag, FeatureFlagDefinition> = {
  voice: {
    id: 'voice',
    name: 'Voice Input & Output',
    description: 'Enable voice input and text-to-speech output',
    defaultValue: true,
    category: 'core'
  },
  rag: {
    id: 'rag',
    name: 'Retrieval Augmented Generation',
    description: 'Enable context-aware AI responses using vector search',
    defaultValue: true,
    category: 'core'
  },
  modeSwitch: {
    id: 'modeSwitch',
    name: 'Mode Switching',
    description: 'Allow switching between chat, code, and image modes',
    defaultValue: true,
    category: 'core'
  },
  notifications: {
    id: 'notifications',
    name: 'Notifications',
    description: 'Enable desktop and in-app notifications',
    defaultValue: true,
    category: 'core'
  },
  github: {
    id: 'github',
    name: 'GitHub Integration',
    description: 'Enable GitHub repository access and sync',
    defaultValue: true,
    category: 'core'
  },
  codeAssistant: {
    id: 'codeAssistant',
    name: 'Code Assistant',
    description: 'Enable intelligent code completion and suggestions',
    defaultValue: true,
    category: 'core',
    dependencies: ['modeSwitch']
  },
  ragSupport: {
    id: 'ragSupport',
    name: 'RAG Support',
    description: 'Enable support for retrieval augmented generation',
    defaultValue: true,
    category: 'core',
    dependencies: ['rag']
  },
  githubSync: {
    id: 'githubSync',
    name: 'GitHub Sync',
    description: 'Enable synchronization with GitHub repositories',
    defaultValue: true,
    category: 'core',
    dependencies: ['github']
  },
  tokenEnforcement: {
    id: 'tokenEnforcement',
    name: 'Token Enforcement',
    description: 'Enable token usage limits and enforcement',
    defaultValue: false,
    category: 'premium'
  }
};
