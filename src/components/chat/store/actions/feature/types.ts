import { ProviderType } from '@/components/chat/store/types/chat-store-types';

export type ChatFeature = 'token' | 'openai' | 'github' | 'anthropic' | 'gemini';

export function convertFeatureKeyToChatFeature(key: string | null): ChatFeature | null {
  if (!key) return null;
  
  const featureKey = key.toLowerCase();
  if (featureKey === 'token') return 'token';
  if (featureKey === 'openai') return 'openai';
  if (featureKey === 'github') return 'github';
  if (featureKey === 'anthropic') return 'anthropic';
  if (featureKey === 'gemini') return 'gemini';
  return null;
}

export interface FeatureActionPayload {
  feature: ChatFeature;
  enabled: boolean;
}

export interface ProviderActionPayload {
  provider: ProviderType;
  enabled: boolean;
}
