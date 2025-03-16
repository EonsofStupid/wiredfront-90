
import { useEffect, useState } from 'react';
import { useChatStore } from '@/components/chat/store/chatStore';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { useCombinedFeatureFlag } from './useFeatureFlags';
import { FeatureKey } from './useFeatureFlags';
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';
import { Json } from '@/integrations/supabase/types';
import { isTokenEnforcementMode, extractEnforcementMode } from '@/utils/token-utils';
import { withTokenErrorBoundary } from '@/components/tokens/TokenErrorBoundary';

export function useTokenManagement() {
  const { user } = useAuthStore();
  const { 
    tokenControl, 
    features,
    addTokens, 
    spendTokens, 
    setTokenBalance,
    setTokenEnforcementMode,
    setFeatureState 
  } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const tokenEnforcementFlag = useCombinedFeatureFlag('tokenEnforcement');
  
  // Fetch user's token balance on mount if authenticated
  useEffect(() => {
    const fetchTokenBalance = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('user_tokens')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          logger.error('Error fetching token balance:', error);
          setError(new Error(`Failed to fetch token balance: ${error.message}`));
          return;
        }
        
        if (data) {
          setTokenBalance(data.balance);
        } else {
          // Create a new entry if one doesn't exist
          const { error: insertError } = await supabase
            .from('user_tokens')
            .insert({ user_id: user.id, balance: 10 }); // Default 10 tokens
          
          if (insertError) {
            logger.error('Error creating token balance:', insertError);
            setError(new Error(`Failed to create token balance: ${insertError.message}`));
            return;
          }
          
          setTokenBalance(10);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Error in fetchTokenBalance:', error);
        setError(new Error(`An unexpected error occurred: ${errorMessage}`));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTokenBalance();
  }, [user?.id, setTokenBalance]);
  
  // Fetch token enforcement configuration
  useEffect(() => {
    const fetchTokenConfig = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('feature_flags')
          .select('*')
          .eq('key', 'token_enforcement')
          .maybeSingle();
        
        if (error) {
          logger.error('Error fetching token config:', error);
          return;
        }
        
        if (data) {
          // Enable/disable token enforcement based on global flag
          setFeatureState('tokenEnforcement', data.enabled);
          
          // Set enforcement mode from metadata if available
          if (data.metadata) {
            const mode = extractEnforcementMode(data.metadata);
            if (mode) {
              setTokenEnforcementMode(mode);
            } else {
              logger.warn('No valid enforcement mode found in metadata');
            }
          }
        }
      } catch (error) {
        logger.error('Error in fetchTokenConfig:', error);
      }
    };
    
    fetchTokenConfig();
  }, [user?.id, setFeatureState, setTokenEnforcementMode]);
  
  // Function to check if a user has enough tokens for an operation
  const hasEnoughTokens = (amount = 1) => {
    // If token enforcement is disabled, always return true
    if (!features.tokenEnforcement) return true;
    
    return tokenControl.balance >= amount;
  };
  
  // Function to handle token spending with error handling
  const handleSpendTokens = async (amount = 1) => {
    // If token enforcement is disabled, allow the operation
    if (!features.tokenEnforcement) return true;
    
    if (!user) {
      toast.error('You must be logged in to use this feature');
      return false;
    }
    
    if (!hasEnoughTokens(amount)) {
      toast.error(`Not enough tokens. You need ${amount} tokens for this operation.`);
      return false;
    }
    
    try {
      const success = await spendTokens(amount);
      if (!success) {
        toast.error('Failed to process tokens. Please try again.');
      }
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Error spending tokens:', error);
      toast.error(`Error processing tokens: ${errorMessage}`);
      return false;
    }
  };
  
  return {
    tokenBalance: tokenControl.balance,
    enforcementMode: tokenControl.enforcementMode,
    isTokenEnforcementEnabled: features.tokenEnforcement,
    tokensPerQuery: tokenControl.tokensPerQuery,
    freeQueryLimit: tokenControl.freeQueryLimit,
    queriesUsed: tokenControl.queriesUsed,
    isLoading,
    error,
    addTokens,
    spendTokens: handleSpendTokens,
    setTokenBalance,
    hasEnoughTokens,
    setEnforcementMode: setTokenEnforcementMode,
    toggleTokenEnforcement: () => setFeatureState('tokenEnforcement', !features.tokenEnforcement)
  };
}

// Export the error boundary wrapper for token-related components
export { withTokenErrorBoundary };
