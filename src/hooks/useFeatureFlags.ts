
import { useState, useEffect, useCallback } from "react";
import { useChatStore } from "@/components/chat/store/chatStore";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { useFeatureFlag } from "./useFeatureFlag";
import { toast } from "sonner";
import { KnownFeatureFlag } from "@/types/admin/settings/feature-flags";
import { FeatureKey } from "@/components/chat/store/actions/feature/types";

export function useFeatureFlags() {
  const { features, toggleFeature, enableFeature, disableFeature, setFeatureState } = useChatStore();
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Check if a feature is enabled in the local store
   */
  const isEnabled = useCallback(
    (featureKey: keyof typeof features) => {
      return features[featureKey as keyof typeof features] || false;
    },
    [features]
  );

  /**
   * Toggle a feature with database logging
   */
  const handleToggleFeature = useCallback(
    async (featureKey: keyof typeof features) => {
      if (isUpdating) return;
      
      setIsUpdating(true);
      try {
        // Use the store's action to toggle the feature
        toggleFeature(featureKey);
        
        // Log the feature usage
        await logFeatureUsage(featureKey, { action: 'toggle' });
      } catch (error) {
        logger.error(`Error toggling feature ${featureKey}:`, error);
        toast.error(`Failed to toggle ${featureKey} feature`);
      } finally {
        setIsUpdating(false);
      }
    },
    [toggleFeature, isUpdating]
  );

  /**
   * Enable a feature with database logging
   */
  const handleEnableFeature = useCallback(
    async (featureKey: keyof typeof features) => {
      if (isUpdating) return;
      
      setIsUpdating(true);
      try {
        // Use the store's action to enable the feature
        enableFeature(featureKey);
        
        // Log the feature usage
        await logFeatureUsage(featureKey, { action: 'enable' });
      } catch (error) {
        logger.error(`Error enabling feature ${featureKey}:`, error);
        toast.error(`Failed to enable ${featureKey} feature`);
      } finally {
        setIsUpdating(false);
      }
    },
    [enableFeature, isUpdating]
  );

  /**
   * Disable a feature with database logging
   */
  const handleDisableFeature = useCallback(
    async (featureKey: keyof typeof features) => {
      if (isUpdating) return;
      
      setIsUpdating(true);
      try {
        // Use the store's action to disable the feature
        disableFeature(featureKey);
        
        // Log the feature usage
        await logFeatureUsage(featureKey, { action: 'disable' });
      } catch (error) {
        logger.error(`Error disabling feature ${featureKey}:`, error);
        toast.error(`Failed to disable ${featureKey} feature`);
      } finally {
        setIsUpdating(false);
      }
    },
    [disableFeature, isUpdating]
  );

  /**
   * Set a feature state with database logging
   */
  const handleSetFeatureState = useCallback(
    async (featureKey: keyof typeof features, isEnabled: boolean) => {
      if (isUpdating) return;
      
      setIsUpdating(true);
      try {
        // Use the store's action to set the feature state
        setFeatureState(featureKey, isEnabled);
        
        // Log the feature usage
        await logFeatureUsage(featureKey, { 
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
    [setFeatureState, isUpdating]
  );

  // Helper function to log feature usage
  const logFeatureUsage = async (featureKey: string, context: Record<string, any> = {}) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;
      
      await supabase.from('feature_usage').insert({
        user_id: userData.user.id,
        feature_name: featureKey,
        context
      });
    } catch (error) {
      logger.error(`Error logging feature usage for ${featureKey}:`, error);
    }
  };

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
export function useCombinedFeatureFlag(featureKey: string) {
  const { isEnabled: isLocalEnabled } = useFeatureFlags();
  const { isEnabled: isRemoteEnabled, isLoading } = useFeatureFlag(featureKey);
  
  // Combined flag is enabled if either local or remote is enabled
  // We prioritize the remote flag when it's available
  const isEnabled = isLoading ? isLocalEnabled(featureKey as keyof typeof features) : (isRemoteEnabled || isLocalEnabled(featureKey as keyof typeof features));
  
  return {
    isEnabled,
    isLoading,
    isLocalEnabled: isLocalEnabled(featureKey as keyof typeof features),
    isRemoteEnabled
  };
}
