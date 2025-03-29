
export type FeatureKey = 
  | 'voice'
  | 'rag'
  | 'modeSwitch'
  | 'notifications'
  | 'github'
  | 'codeAssistant'
  | 'ragSupport'
  | 'githubSync'
  | 'knowledgeBase'
  | 'tokenEnforcement'
  | 'standardChat'      // For standard chat mode
  | 'imageGeneration'   // For image generation
  | 'training';         // For training mode

export interface Features {
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
  standardChat: boolean;
  imageGeneration: boolean;
  training: boolean;
}
