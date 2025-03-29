
/**
 * Provider type enumeration
 */
export enum ProviderType {
  Chat = 'chat',
  Image = 'image',
  Embeddings = 'embeddings',
  Both = 'both',
  Integration = 'integration'
}

/**
 * Available provider record from the database
 */
export interface AvailableProviderRecord {
  id: string;
  name: string;
  display_name: string;
  provider_type: ProviderType | string;
  is_enabled: boolean;
  required_keys: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Provider model information
 */
export interface ProviderModel {
  id: string;
  name: string;
  displayName: string;
  maxTokens?: number;
  capabilities?: string[];
  isEnabled?: boolean;
}

/**
 * Provider interface for chat providers
 */
export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  isDefault: boolean;
  isEnabled: boolean;
  category: 'chat' | 'image' | 'integration';
  description?: string;
  iconUrl?: string;
  models: ProviderModel[];
}

/**
 * Map from string to ProviderType enum
 */
export function stringToProviderType(type: string): ProviderType {
  switch (type?.toLowerCase()) {
    case 'chat': return ProviderType.Chat;
    case 'image': return ProviderType.Image;
    case 'embeddings': return ProviderType.Embeddings;
    case 'both': return ProviderType.Both;
    case 'integration': return ProviderType.Integration;
    default: return ProviderType.Chat;
  }
}

/**
 * Convert ProviderType to string
 */
export function providerTypeToString(type: ProviderType): string {
  return type.toString();
}
