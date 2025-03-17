
import { useState, useEffect } from 'react';
import { useChatStore } from '@/components/chat/store/chatStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';
import { useFeatureFlags } from './useFeatureFlags';
import { KnownFeatureFlag } from '@/types/admin/settings/feature-flags';
import { isTokenEnforcementMode } from '@/utils/token-utils';
import { convertFeatureKeyToChatFeature } from '@/components/chat/store/actions/feature/types';

export function useTokenManagement() {
  const { tokenControl, setTokenEnforcementMode, addTokens, spendTokens, setTokenBalance } = useChatStore();
  const { isEnabled, toggleFeature } = useFeatureFlags();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Expose tokenBalance and enforcementMode directly
  const tokenBalance = tokenControl.balance;
  const enforcementMode = tokenControl.enforcementMode as TokenEnforcementMode;

  // Setters for token enforcement mode with validation
  const setEnforcementMode = (mode: TokenEnforcementMode) => {
    // Validate the mode - this will ensure TypeScript knows it's a valid value
    if (isTokenEnforcementMode(mode)) {
      setTokenEnforcementMode(mode);
    } else {
      console.error(`Invalid token enforcement mode: ${mode}`);
      toast.error('Invalid token enforcement mode');
    }
  };

  // Load token settings from the database
  useEffect(() => {
    const loadTokenSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get current user
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          setIsLoading(false);
          return;
        }
        
        // Get token settings
        const { data, error } = await supabase
          .from('user_tokens')
          .select('*')
          .eq('user_id', userData.user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" which is expected for new users
          console.error('Error loading token settings:', error);
          toast.error('Failed to load token settings');
          setError(new Error(error.message));
        } else if (data) {
          // Set token balance and settings with validation
          setTokenBalance(data.balance || 0);
          
          // Validate enforcement_mode before setting it
          const enforcementMode = data.enforcement_mode || 'never';
          if (isTokenEnforcementMode(enforcementMode)) {
            setTokenEnforcementMode(enforcementMode);
          } else {
            // Default to 'never' if invalid
            setTokenEnforcementMode('never');
          }
          
          // Enable token enforcement feature flag if it's enabled in settings
          const tokenEnforcementKey = convertFeatureKeyToChatFeature(KnownFeatureFlag.TOKEN_CONTROL);
          if (data.enforcement_mode !== 'never' && tokenEnforcementKey && !isEnabled(KnownFeatureFlag.TOKEN_CONTROL)) {
            toggleFeature(tokenEnforcementKey);
          }
        }
      } catch (error) {
        console.error('Error in loadTokenSettings:', error);
        setError(error instanceof Error ? error : new Error('Unknown error loading token settings'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTokenSettings();
  }, []);

  // Toggle token enforcement
  const toggleTokenEnforcement = async () => {
    try {
      setIsSubmitting(true);
      
      // Convert to chat feature key
      const tokenEnforcementKey = convertFeatureKeyToChatFeature(KnownFeatureFlag.TOKEN_CONTROL);
      if (!tokenEnforcementKey) {
        throw new Error('Failed to map TOKEN_CONTROL to a chat feature key');
      }
      
      // Toggle the feature flag
      toggleFeature(tokenEnforcementKey);
      
      // If it's being enabled, set the enforcement mode to 'always'
      // If it's being disabled, set it to 'never'
      const newMode: TokenEnforcementMode = isEnabled(KnownFeatureFlag.TOKEN_CONTROL) ? 'never' : 'always';
      
      await handleUpdateEnforcementConfig(newMode);
      
      toast.success(`Token enforcement ${newMode === 'never' ? 'disabled' : 'enabled'}`);
    } catch (error) {
      console.error('Error toggling token enforcement:', error);
      toast.error('Failed to update token enforcement settings');
      setError(error instanceof Error ? error : new Error('Failed to toggle token enforcement'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update token enforcement configuration
  const handleUpdateEnforcementConfig = async (mode: TokenEnforcementMode) => {
    try {
      setIsSubmitting(true);
      
      // Update local state
      setEnforcementMode(mode);
      
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      // Update in database
      const { error } = await supabase
        .from('user_tokens')
        .upsert({
          user_id: userData.user.id,
          enforcement_mode: mode,
          last_updated: new Date().toISOString()
        }, { onConflict: 'user_id' });
      
      if (error) {
        throw error;
      }
      
      // Get chat feature key
      const tokenEnforcementKey = convertFeatureKeyToChatFeature(KnownFeatureFlag.TOKEN_CONTROL);
      if (!tokenEnforcementKey) {
        throw new Error('Failed to map TOKEN_CONTROL to a chat feature key');
      }
      
      // If mode is 'never', ensure tokenEnforcement feature is disabled
      if (mode === 'never' && isEnabled(KnownFeatureFlag.TOKEN_CONTROL)) {
        toggleFeature(tokenEnforcementKey);
      }
      
      // If mode is not 'never', ensure tokenEnforcement feature is enabled
      if (mode !== 'never' && !isEnabled(KnownFeatureFlag.TOKEN_CONTROL)) {
        toggleFeature(tokenEnforcementKey);
      }
      
      toast.success('Token enforcement settings updated');
    } catch (error) {
      console.error('Error updating enforcement config:', error);
      toast.error('Failed to update token enforcement settings');
      setError(error instanceof Error ? error : new Error('Failed to update enforcement config'));
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    tokenControl,
    tokenBalance,
    enforcementMode,
    isTokenEnforcementEnabled: isEnabled(KnownFeatureFlag.TOKEN_CONTROL),
    toggleTokenEnforcement,
    handleUpdateEnforcementConfig,
    setEnforcementMode,
    addTokens,
    spendTokens,
    setTokenBalance,
    isSubmitting,
    isLoading,
    error
  };
}
