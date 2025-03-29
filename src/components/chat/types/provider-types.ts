
import { ProviderModel, Provider as BaseProvider } from '@/types/chat/providers';

// Re-export the base provider model type to ensure consistency
export type { ProviderModel };

/**
 * Extended provider interface for the chat components
 * This extends the base Provider type with additional UI-specific properties
 */
export interface Provider extends BaseProvider {
  displayName: string;  // UI-friendly name (may be different from internal name)
  isDefault?: boolean;  // Whether this is the default provider for new chats
}

/**
 * Provider selection interface for UI
 */
export interface ProviderSelection {
  provider: Provider;
  model: ProviderModel;
}

/**
 * Convert a base provider to an enhanced UI provider
 */
export const enhanceProvider = (provider: BaseProvider): Provider => {
  return {
    ...provider,
    displayName: provider.displayName || provider.name,
    isDefault: provider.isDefault || false
  };
};

/**
 * Adapt a base provider to the enhanced UI provider interface
 */
export const adaptProvider = (provider: BaseProvider): Provider => enhanceProvider(provider);

/**
 * Adapt multiple base providers to enhanced UI providers
 */
export const adaptProviders = (providers: BaseProvider[]): Provider[] => 
  providers.map(enhanceProvider);
