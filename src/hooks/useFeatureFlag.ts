
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth";
import { useRoleStore } from "@/stores/role";
import { FeatureFlag, mapFeatureFlagToChat } from "@/types/admin/settings/feature-flags";
import { AppRole } from "@/integrations/supabase/types/enums";

export function useFeatureFlag(flagKey: string) {
  const { user } = useAuthStore();
  const { roles } = useRoleStore();
  const userRole = roles[0] as AppRole;

  const { data, isLoading } = useQuery({
    queryKey: ['feature-flag', flagKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .eq('key', flagKey)
        .single();

      if (error) {
        console.error(`Error fetching feature flag ${flagKey}:`, error);
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
          updated_by: null,
          metadata: null
        } as FeatureFlag;
      }

      return data as FeatureFlag;
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
    if (data.rollout_percentage && data.rollout_percentage < 100) {
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
    featureFlag: data,
    // Add helper for chat features
    chatFeatureKey: data?.key ? mapFeatureFlagToChat(data.key as any) : null
  };
}

// Simple hash function to get deterministic number from string
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
