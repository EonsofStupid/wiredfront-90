
import { useChatFeatures, useChatFeature } from './chat/chatFeatures';
import { useAdminFeatures, useAdminFeature } from './admin/adminFeatures';
import { useAppFeatures, useAppFeature } from './app/appFeatures';
import { useBetaFeatures, useBetaFeature } from './beta/betaFeatures';
import { 
  ChatFeatureKey, 
  AdminFeatureKey,
  AppFeatureKey,
  BetaFeatureKey
} from '@/types/features';

/**
 * Global feature hooks (generally prefer domain-specific hooks)
 */
export {
  useChatFeatures,
  useChatFeature,
  useAdminFeatures,
  useAdminFeature,
  useAppFeatures,
  useAppFeature,
  useBetaFeatures,
  useBetaFeature
};

/**
 * Re-export feature key types
 */
export type {
  ChatFeatureKey,
  AdminFeatureKey,
  AppFeatureKey,
  BetaFeatureKey
};

/**
 * Initialize all feature stores at app startup
 */
export const initializeFeatures = async () => {
  // Initialize all feature stores in parallel
  await Promise.all([
    useAppFeatures.getState().initialize(),
    useChatFeatures.getState().initialize(),
    useAdminFeatures.getState().initialize(),
    useBetaFeatures.getState().initialize()
  ]);
};
