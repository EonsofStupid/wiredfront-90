
// Create this file if it doesn't exist
export type ProviderCategoryType = 'chat' | 'image' | 'other' | 'vector' | 'voice';

export interface ProviderCategory {
  id: string;
  name: string;
  type: ProviderCategoryType;
  isEnabled?: boolean;
  isDefault?: boolean;
  supportedModes?: string[];
  models?: string[];
  icon?: string;
}
