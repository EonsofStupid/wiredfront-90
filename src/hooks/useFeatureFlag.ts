
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth";
import { useRoleStore } from "@/stores/role";
import { FeatureFlag } from "@/types/admin/settings/feature-flags";
import { logger } from "@/services/chat/LoggingService";

/**
 * Hook to query feature flag status from the database
 * @param flagKey The feature flag key to check
 * @returns Object containing whether the flag is enabled, loading status, and the feature flag data
 */
export function useFeatureFlag(flagKey: string) {
  const { user } = useAuthStore();
  const { roles } = useRoleStore();
  const userRole = roles?.[0]; // Get first role (most important)

  const { data, isLoading, error } = useQuery({
    queryKey: ['feature-flag', flagKey],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('feature_flags')
          .select('*')
          .eq('key', flagKey)
          .single();

        if (error) {
          logger.error(`Error fetching feature flag ${flagKey}:`, error);
          // Return a fallback object with the same shape as the expected feature flag
          return {
            id: '',
            key: flagKey,
            name: '',
            description: null,
            enabled: false,
            target_roles: null,
            rollout_percentage: 0,
            created_at: null,
            updated_at: null,
            created_by: null,
          } as FeatureFlag;
        }

        return data as FeatureFlag;
      } catch (error) {
        logger.error(`Unexpected error fetching feature flag ${flagKey}:`, error);
        return {
          id: '',
          key: flagKey,
          name: '',
          description: null,
          enabled: false,
          target_roles: null,
          rollout_percentage: 0,
          created_at: null,
          updated_at: null,
          created_by: null,
        } as FeatureFlag;
      }
    },
  });

  // Function to check if the flag is enabled for the current user
  const isEnabled = () => {
    if (isLoading || !data) return false;
    
    // If the flag is disabled, no one gets it
    if (!data.enabled) return false;
    
    // Check role targeting
    if (data.target_roles && data.target_roles.length > 0) {
      if (!userRole || !data.target_roles.includes(userRole)) {
        return false;
      }
    }
    
    // Check percentage rollout
    if (data.rollout_percentage < 100) {
      // Use user ID as consistent seed for randomization
      // This ensures a user always gets the same result
      if (!user?.id) return false;
      
      const hash = hashCode(user.id);
      const normalized = (hash % 100) + 100; // Ensure positive
      const userPercentile = normalized % 100; // 0-99
      
      return userPercentile < data.rollout_percentage;
    }
    
    return true;
  };

  return {
    isEnabled: isEnabled(),
    isLoading,
    data,
    error
  };
}

// Simple string hash function for consistent user percentiles
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
