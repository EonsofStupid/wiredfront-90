
import { useEffect, useState } from 'react';
import { useChatStore } from '@/components/chat/store/chatStore';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { useCombinedFeatureFlag } from './useFeatureFlags';

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
  
  const tokenEnforcementFlag = useCombinedFeatureFlag('tokenEnforcement');
  
  // Fetch user's token balance on mount if authenticated
  useEffect(() => {
    const fetchTokenBalance = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_tokens')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          logger.error('Error fetching token balance:', error);
          return;
        }
        
        if (data) {
          setTokenBalance(data.balance);
        } else {
          // Create a new entry if one doesn't exist
          await supabase
            .from('user_tokens')
            .insert({ user_id: user.id, balance: 10 }); // Default 10 tokens
          
          setTokenBalance(10);
        }
      } catch (error) {
        logger.error('Error in fetchTokenBalance:', error);
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
          .single();
        
        if (error) {
          if (error.code !== 'PGRST116') {
            logger.error('Error fetching token config:', error);
          }
          return;
        }
        
        if (data) {
          // Enable/disable token enforcement based on global flag
          setFeatureState('tokenEnforcement', data.enabled);
          
          // Set enforcement mode from metadata if available
          if (data.metadata && data.metadata.enforcementMode) {
            setTokenEnforcementMode(data.metadata.enforcementMode);
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
    
    const success = await spendTokens(amount);
    if (!success) {
      toast.error('Failed to process tokens. Please try again.');
    }
    return success;
  };
  
  return {
    tokenBalance: tokenControl.balance,
    enforcementMode: tokenControl.enforcementMode,
    isTokenEnforcementEnabled: features.tokenEnforcement,
    tokensPerQuery: tokenControl.tokensPerQuery,
    freeQueryLimit: tokenControl.freeQueryLimit,
    queriesUsed: tokenControl.queriesUsed,
    isLoading,
    addTokens,
    spendTokens: handleSpendTokens,
    setTokenBalance,
    hasEnoughTokens,
    setEnforcementMode: setTokenEnforcementMode,
    toggleTokenEnforcement: () => setFeatureState('tokenEnforcement', !features.tokenEnforcement)
  };
}
