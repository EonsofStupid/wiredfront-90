
import { useState, useEffect, useCallback } from "react";
import { useChatStore } from "@/components/chat/store/chatStore";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { useFeatureFlag } from "./useFeatureFlag";
import { toast } from "sonner";
import { 
  KnownFeatureFlag, 
  mapFeatureFlagToChat, 
  ChatFeatureKey 
} from "@/types/admin/settings/feature-flags";
import { convertFeatureKeyToChatFeature } from "@/components/chat/store/actions/feature/types";

export function useFeatureFlags() {
  const { features, toggleFeature, enableFeature, disableFeature, setFeatureState } = useChatStore();
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Check if a feature is enabled in the local store
   */
  const isEnabled = useCallback(
    (featureKey: KnownFeatureFlag | ChatFeatureKey) => {
      // Convert KnownFeatureFlag to ChatFeatureKey if needed
      const chatFeatureKey = convertFeatureKeyToChatFeature(featureKey);
      
      // If it can't be mapped, it's not a chat feature
      if (!chatFeatureKey) return false;
      
      return features[chatFeatureKey] || false;
    },
    [features]
  );

  /**
   * Toggle a feature with database logging
   */
  const handleToggleFeature = useCallback(
    async (featureKey: KnownFeatureFlag | ChatFeatureKey) => {
      if (isUpdating) return;
      
      // Convert to ChatFeatureKey if it's a KnownFeatureFlag
      const chatFeatureKey = convertFeatureKeyToChatFeature(featureKey);
      
      // If we couldn't map it to a chat feature, we can't toggle it
      if (!chatFeatureKey) {
        logger.error(`Feature ${featureKey} cannot be toggled as it's not a chat feature`);
        toast.error(`Cannot toggle this feature in the chat interface`);
        return;
      }
      
      setIsUpdating(true);
      try {
        // Use the store's action to toggle the feature
        toggleFeature(chatFeatureKey);
        
        // Log the feature usage
        await logFeatureUsage(String(featureKey), { action: 'toggle' });
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
    async (featureKey: KnownFeatureFlag | ChatFeatureKey) => {
      if (isUpdating) return;
      
      // Convert to ChatFeatureKey if it's a KnownFeatureFlag
      const chatFeatureKey = convertFeatureKeyToChatFeature(featureKey);
      
      // If we couldn't map it to a chat feature, we can't enable it
      if (!chatFeatureKey) {
        logger.error(`Feature ${featureKey} cannot be enabled as it's not a chat feature`);
        toast.error(`Cannot enable this feature in the chat interface`);
        return;
      }
      
      setIsUpdating(true);
      try {
        // Use the store's action to enable the feature
        enableFeature(chatFeatureKey);
        
        // Log the feature usage
        await logFeatureUsage(String(featureKey), { action: 'enable' });
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
    async (featureKey: KnownFeatureFlag | ChatFeatureKey) => {
      if (isUpdating) return;
      
      // Convert to ChatFeatureKey if it's a KnownFeatureFlag
      const chatFeatureKey = convertFeatureKeyToChatFeature(featureKey);
      
      // If we couldn't map it to a chat feature, we can't disable it
      if (!chatFeatureKey) {
        logger.error(`Feature ${featureKey} cannot be disabled as it's not a chat feature`);
        toast.error(`Cannot disable this feature in the chat interface`);
        return;
      }
      
      setIsUpdating(true);
      try {
        // Use the store's action to disable the feature
        disableFeature(chatFeatureKey);
        
        // Log the feature usage
        await logFeatureUsage(String(featureKey), { action: 'disable' });
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
    async (featureKey: KnownFeatureFlag | ChatFeatureKey, isEnabled: boolean) => {
      if (isUpdating) return;
      
      // Convert to ChatFeatureKey if it's a KnownFeatureFlag
      const chatFeatureKey = convertFeatureKeyToChatFeature(featureKey);
      
      // If we couldn't map it to a chat feature, we can't set its state
      if (!chatFeatureKey) {
        logger.error(`Feature ${featureKey} state cannot be set as it's not a chat feature`);
        toast.error(`Cannot update this feature in the chat interface`);
        return;
      }
      
      setIsUpdating(true);
      try {
        // Use the store's action to set the feature state
        setFeatureState(chatFeatureKey, isEnabled);
        
        // Log the feature usage
        await logFeatureUsage(String(featureKey), { 
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
  const { features, isEnabled: checkLocalEnabled } = useFeatureFlags();
  const { isEnabled: isRemoteEnabled, isLoading } = useFeatureFlag(featureKey);
  
  // Check if the key is a valid chat feature key
  const chatFeatureKey = convertFeatureKeyToChatFeature(featureKey as any);
  
  // Check local enablement
  const isLocalEnabled = chatFeatureKey ? features[chatFeatureKey] : false;
  
  // Combined flag is enabled if either local or remote is enabled
  // We prioritize the remote flag when it's available
  const isEnabled = isLoading ? isLocalEnabled : (isRemoteEnabled || isLocalEnabled);
  
  return {
    isEnabled,
    isLoading,
    isLocalEnabled,
    isRemoteEnabled
  };
}
