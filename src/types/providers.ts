
import { ProviderCategoryType } from '@/components/chat/store/types/chat-store-types';

export interface ProviderCategory {
  id: string;
  name: string;
  type: ProviderCategoryType;
  isDefault: boolean;
  category?: string;
  models?: string[];
  isEnabled?: boolean;
}

export interface ProviderModel {
  id: string;
  name: string;
  context_length: number;
  isDefault: boolean;
  provider: string;
}

export interface ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  organization?: string;
  defaultModel?: string;
  models?: string[];
}
