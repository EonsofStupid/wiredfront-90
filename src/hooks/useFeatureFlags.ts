
import { useState, useEffect, useCallback } from "react";
import { useChatStore } from "@/components/chat/store/chatStore";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { useFeatureFlag } from "./useFeatureFlag";
import { toast } from "sonner";
import { useFeatureUsage } from "./useFeatureUsage";
import { debounce } from "lodash";

export type FeatureKey = 'voice' | 'rag' | 'modeSwitch' | 'notifications' | 'github' | 
                         'codeAssistant' | 'ragSupport' | 'githubSync';

export function useFeatureFlags() {
  const { features, toggleFeature, enableFeature, disableFeature, setFeatureState } = useChatStore();
  const { logFeatureUsage } = useFeatureUsage();
  const [isUpdating, setIsUpdating] = useState(false);

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
   * Toggle a feature with database logging (debounced)
   */
  const handleToggleFeature = useCallback(
    debounce(async (featureKey: FeatureKey) => {
      if (isUpdating) return;
      
      setIsUpdating(true);
      try {
        // Use the store's action to toggle the feature
        toggleFeature(featureKey);
        
        // Log the feature usage
        await logFeatureUsage(featureKey, { action: 'toggle' });
        
        // Log to feature toggle history table
        await logFeatureToggleToHistory(featureKey, !features[featureKey], features[featureKey]);
      } catch (error) {
        logger.error(`Error toggling feature ${featureKey}:`, error);
        toast.error(`Failed to toggle ${featureKey} feature`);
      } finally {
        setIsUpdating(false);
      }
    }, 300),
    [toggleFeature, logFeatureUsage, isUpdating, features]
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
        
        // Log the feature usage
        await logFeatureUsage(featureKey, { action: 'enable' });
        
        // Log to feature toggle history table
        await logFeatureToggleToHistory(featureKey, features[featureKey], true);
      } catch (error) {
        logger.error(`Error enabling feature ${featureKey}:`, error);
        toast.error(`Failed to enable ${featureKey} feature`);
      } finally {
        setIsUpdating(false);
      }
    },
    [enableFeature, logFeatureUsage, isUpdating, features]
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
        
        // Log the feature usage
        await logFeatureUsage(featureKey, { action: 'disable' });
        
        // Log to feature toggle history table
        await logFeatureToggleToHistory(featureKey, features[featureKey], false);
      } catch (error) {
        logger.error(`Error disabling feature ${featureKey}:`, error);
        toast.error(`Failed to disable ${featureKey} feature`);
      } finally {
        setIsUpdating(false);
      }
    },
    [disableFeature, logFeatureUsage, isUpdating, features]
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
        
        // Log the feature usage
        await logFeatureUsage(featureKey, { 
          action: 'setState', 
          enabled: isEnabled 
        });
        
        // Log to feature toggle history table
        await logFeatureToggleToHistory(featureKey, features[featureKey], isEnabled);
      } catch (error) {
        logger.error(`Error setting feature ${featureKey} state:`, error);
        toast.error(`Failed to update ${featureKey} feature`);
      } finally {
        setIsUpdating(false);
      }
    },
    [setFeatureState, logFeatureUsage, isUpdating, features]
  );

  // Helper function to log feature toggle to history table
  const logFeatureToggleToHistory = async (
    featureKey: FeatureKey,
    oldValue: boolean | undefined,
    newValue: boolean
  ) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      // Log to feature_toggle_history table
      await supabase.from('feature_toggle_history').insert({
        user_id: userData.user.id,
        feature_name: featureKey,
        old_value: oldValue,
        new_value: newValue,
        metadata: { 
          source: 'client_app',
          timestamp: new Date().toISOString()
        }
      });

      logger.info(`Feature ${featureKey} ${newValue ? 'enabled' : 'disabled'}`, { 
        feature: featureKey, 
        oldValue, 
        newValue 
      });
    } catch (error) {
      logger.error('Error logging feature toggle to history:', error);
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
