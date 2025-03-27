
import { ChatState } from '../../types/chat-store-types';

// Define types for state management functions
export type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean,
  action?: string | { type: string; [key: string]: any }
) => void;

export type GetState<T> = () => T;

// Define feature action keys
export type FeatureKey = 
  | 'voice'
  | 'rag'
  | 'modeSwitch'
  | 'notifications'
  | 'github'
  | 'codeAssistant'
  | 'ragSupport'
  | 'githubSync'
  | 'tokenEnforcement'
  | string;

// Common feature actions
export interface FeatureActions {
  // Feature toggle actions
  toggleFeature: (key: FeatureKey) => void;
  enableFeature: (key: FeatureKey) => void;
  disableFeature: (key: FeatureKey) => void;
  setFeatureState: (key: FeatureKey, enabled: boolean) => void;

  // Position actions
  togglePosition: () => void;
  setPosition: (position: any) => void;
  
  // Mode actions
  toggleMode: () => void;
  setMode: (mode: string) => void;
  
  // Model actions
  setModel: (model: string) => void;
  
  // Token actions
  setTokenBalance: (balance: number) => void;
  
  // Dock actions
  toggleDocked: () => void;
  setDocked: (docked: boolean) => void;
  
  // Provider actions
  updateProviders: (providers: any[]) => void;
  updateChatProvider: (provider: any) => void;
}
