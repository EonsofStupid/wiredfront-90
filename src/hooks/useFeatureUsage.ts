import { useChatStore } from "@/components/chat/store/chatStore";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { useAuthStore } from "@/stores/auth";
import { useCallback, useState } from "react";

/**
 * A hook to track feature usage and provide feature availability information
 */
export function useFeatureUsage() {
  const { user } = useAuthStore();
  const { features } = useChatStore();
  const [isLogging, setIsLogging] = useState(false);

  /**
   * Log a feature usage event to the database
   */
  const logFeatureUsage = useCallback(
    async (featureName: string, context: Record<string, any> = {}) => {
      if (!user?.id || isLogging) return;

      setIsLogging(true);
      try {
        // Get the current feature state
        const currentValue =
          features[featureName as keyof typeof features] || false;

        await supabase.from("feature_toggle_history").insert({
          user_id: user.id,
          feature_name: featureName,
          old_value: currentValue,
          new_value: currentValue, // Same value since we're just logging usage
          context,
          metadata: {
            action: "usage",
            timestamp: new Date().toISOString(),
          },
        });

        logger.info(`Feature used: ${featureName}`, {
          feature: featureName,
          context,
        });
      } catch (error) {
        logger.error("Error logging feature usage:", error);
      } finally {
        setIsLogging(false);
      }
    },
    [user, isLogging, features]
  );

  /**
   * Check if a feature is enabled
   */
  const isFeatureEnabled = useCallback(
    (featureKey: string) => {
      return features[featureKey as keyof typeof features] || false;
    },
    [features]
  );

  /**
   * Track a feature usage and perform a callback function if the feature is enabled
   */
  const useFeature = useCallback(
    async <T>(
      featureName: string,
      callback: () => T | Promise<T>,
      context: Record<string, any> = {}
    ): Promise<T | null> => {
      // Check if the feature is enabled
      if (!isFeatureEnabled(featureName)) {
        logger.warn(`Feature "${featureName}" is disabled`);
        return null;
      }

      // Log the feature usage
      await logFeatureUsage(featureName, context);

      // Execute the callback
      try {
        return await callback();
      } catch (error) {
        logger.error(`Error using feature "${featureName}":`, error);
        throw error;
      }
    },
    [isFeatureEnabled, logFeatureUsage]
  );

  return {
    logFeatureUsage,
    isFeatureEnabled,
    useFeature,
  };
}
