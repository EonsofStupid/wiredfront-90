
import { useState, useEffect, useCallback } from "react";
import { useChatStore } from "@/components/chat/store/chatStore";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { useFeatureFlag } from "./useFeatureFlag";
import { toast } from "sonner";
import { KnownFeatureFlag } from "@/types/admin/settings/feature-flags";
import { FeatureKey } from "@/components/chat/store/actions/feature-actions";
import { logFeatureUsage } from "@/components/chat/store/actions/feature/toggle/toggle-utils";
import { useAuthStore } from "@/stores/auth";

// Export is now handled by re-exporting from feature-actions.ts
// export type FeatureKey = KnownFeatureFlag;

export function useFeatureFlags() {
  const { features, toggleFeature, enableFeature, disableFeature, setFeatureState } = useChatStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuthStore();

  /**
   * Check if a feature is enabled in the local store
   */
  const isEnabled = useCallback(
    (featureKey: FeatureKey) => {
      return features[featureKey] || false;
    },
    [features]
  );

  /**
   * Toggle a feature with database logging
   */
  const handleToggleFeature = useCallback(
    async (featureKey: FeatureKey) => {
      if (isUpdating) return;
      
      setIsUpdating(true);
      try {
        // Use the store's action to toggle the feature
        toggleFeature(featureKey);
        
        // Log the feature usage using our utility function
        await logFeatureUsage(featureKey, user?.id, { action: 'toggle' });
      } catch (error) {
        logger.error(`Error toggling feature ${featureKey}:`, error);
        toast.error(`Failed to toggle ${featureKey} feature`);
      } finally {
        setIsUpdating(false);
      }
    },
    [toggleFeature, isUpdating, user?.id]
  );

  /**
   * Enable a feature with database logging
   */
  const handleEnableFeature = useCallback(
    async (featureKey: FeatureKey) => {
      if (isUpdating) return;
      
      setIsUpdating(true);
      try {
        // Use the store's action to enable the feature
        enableFeature(featureKey);
        
        // Log the feature usage using our utility function
        await logFeatureUsage(featureKey, user?.id, { action: 'enable' });
      } catch (error) {
        logger.error(`Error enabling feature ${featureKey}:`, error);
        toast.error(`Failed to enable ${featureKey} feature`);
      } finally {
        setIsUpdating(false);
      }
    },
    [enableFeature, isUpdating, user?.id]
  );

  /**
   * Disable a feature with database logging
   */
  const handleDisableFeature = useCallback(
    async (featureKey: FeatureKey) => {
      if (isUpdating) return;
      
      setIsUpdating(true);
      try {
        // Use the store's action to disable the feature
        disableFeature(featureKey);
        
        // Log the feature usage using our utility function
        await logFeatureUsage(featureKey, user?.id, { action: 'disable' });
      } catch (error) {
        logger.error(`Error disabling feature ${featureKey}:`, error);
        toast.error(`Failed to disable ${featureKey} feature`);
      } finally {
        setIsUpdating(false);
      }
    },
    [disableFeature, isUpdating, user?.id]
  );

  /**
   * Set a feature state with database logging
   */
  const handleSetFeatureState = useCallback(
    async (featureKey: FeatureKey, isEnabled: boolean) => {
      if (isUpdating) return;
      
      setIsUpdating(true);
      try {
        // Use the store's action to set the feature state
        setFeatureState(featureKey, isEnabled);
        
        // Log the feature usage using our utility function
        await logFeatureUsage(featureKey, user?.id, { 
          action: 'setState', 
          enabled: isEnabled 
        });
      } catch (error) {
        logger.error(`Error setting feature ${featureKey} state:`, error);
        toast.error(`Failed to update ${featureKey} feature`);
      } finally {
        setIsUpdating(false);
      }
    },
    [setFeatureState, isUpdating, user?.id]
  );

  return {
    features,
    isEnabled,
    toggleFeature: handleToggleFeature,
    enableFeature: handleEnableFeature,
    disableFeature: handleDisableFeature,
    setFeatureState: handleSetFeatureState,
    isUpdating
  };
}

/**
 * Hook to check a specific feature from both local store and Supabase flag
 */
export function useCombinedFeatureFlag(featureKey: FeatureKey) {
  const { isEnabled: isLocalEnabled } = useFeatureFlags();
  const { isEnabled: isRemoteEnabled, isLoading } = useFeatureFlag(featureKey);
  
  // Combined flag is enabled if either local or remote is enabled
  // We prioritize the remote flag when it's available
  const isEnabled = isLoading ? isLocalEnabled(featureKey) : (isRemoteEnabled || isLocalEnabled(featureKey));
  
  return {
    isEnabled,
    isLoading,
    isLocalEnabled: isLocalEnabled(featureKey),
    isRemoteEnabled
  };
}
