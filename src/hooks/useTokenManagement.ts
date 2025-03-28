
import { useEffect, useState } from 'react';
import { useChatStore } from '@/components/chat/store/chatStore';
import { useTokenStore } from '@/components/chat/store/token';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { useCombinedFeatureFlag } from './useFeatureFlags';
import { FeatureKey } from '@/components/chat/store/actions/feature/types';
import { TokenEnforcementMode } from '@/components/chat/types/chat-modes';
import { extractEnforcementMode } from '@/utils/token-utils';
import { withTokenErrorBoundary } from '@/components/tokens/TokenErrorBoundary';

export function useTokenManagement() {
  const { user } = useAuthStore();
  const { features, setFeatureState } = useChatStore();
  const { 
    balance,
    enforcementMode,
    isEnforcementEnabled,
    tokensPerQuery,
    freeQueryLimit,
    queriesUsed,
    addTokens,
    spendTokens,
    setTokenBalance,
    setEnforcementMode,
    setEnforcementEnabled
  } = useTokenStore();
  
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
          setEnforcementEnabled(data.enabled);
          
          // Set enforcement mode from metadata if available
          if (data.metadata) {
            const mode = extractEnforcementMode(data.metadata);
            if (mode) {
              setEnforcementMode(mode);
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
  }, [user?.id, setFeatureState, setEnforcementMode, setEnforcementEnabled]);
  
  // Function to check if a user has enough tokens for an operation
  const hasEnoughTokens = (amount = 1) => {
    // If token enforcement is disabled, always return true
    if (!features.tokenEnforcement || !isEnforcementEnabled || enforcementMode === 'never') {
      return true;
    }
    
    // If mode is 'warn', allow but will warn
    if (enforcementMode === 'warn') {
      return true;
    }
    
    return balance >= amount;
  };
  
  // Function to handle token spending with error handling
  const handleSpendTokens = async (amount = 1) => {
    // If token enforcement is disabled, allow the operation
    if (!features.tokenEnforcement || !isEnforcementEnabled || enforcementMode === 'never') {
      return true;
    }
    
    if (!user) {
      toast.error('You must be logged in to use this feature');
      return false;
    }
    
    if (!hasEnoughTokens(amount) && enforcementMode !== 'warn') {
      toast.error(`Not enough tokens. You need ${amount} tokens for this operation.`);
      return false;
    }
    
    try {
      const success = await spendTokens(amount);
      if (!success && enforcementMode !== 'warn') {
        toast.error('Failed to process tokens. Please try again.');
      }
      return success || enforcementMode === 'warn';
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Error spending tokens:', error);
      toast.error(`Error processing tokens: ${errorMessage}`);
      return enforcementMode === 'warn'; // Allow operation to proceed if in warn mode
    }
  };
  
  return {
    tokenBalance: balance,
    enforcementMode,
    isTokenEnforcementEnabled: features.tokenEnforcement && isEnforcementEnabled,
    tokensPerQuery,
    freeQueryLimit,
    queriesUsed,
    isLoading,
    error,
    addTokens,
    spendTokens: handleSpendTokens,
    setTokenBalance,
    hasEnoughTokens,
    setEnforcementMode,
    toggleTokenEnforcement: () => {
      setFeatureState('tokenEnforcement', !features.tokenEnforcement);
      setEnforcementEnabled(!isEnforcementEnabled);
    }
  };
}

// Export the error boundary wrapper for token-related components
export { withTokenErrorBoundary };
