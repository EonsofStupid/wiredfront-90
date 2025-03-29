
import { useState, useEffect } from 'react';
import { useChatStore } from '@/components/chat/store/chatStore';
import { useTokenStore } from '@/stores/token';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { useCombinedFeatureFlag } from './useFeatureFlags';
import { TokenEnforcementMode } from '@/types/chat/enums';
import { withTokenErrorBoundary } from '@/components/tokens/TokenErrorBoundary';

export function useTokenManagement() {
  const { user } = useAuthStore();
  const { features, setFeatureState } = useChatStore();
  const tokenStore = useTokenStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const tokenEnforcementFlag = useCombinedFeatureFlag('tokenEnforcement');
  
  // Initialize tokens on mount if authenticated
  useEffect(() => {
    const initializeTokens = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        await tokenStore.initialize();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize tokens'));
        logger.error('Error initializing tokens:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeTokens();
  }, [user?.id, tokenStore]);
  
  // Function to check if a user has enough tokens for an operation
  const hasEnoughTokens = (amount = 1) => {
    // If token enforcement is disabled, always return true
    if (!features.tokenEnforcement || !tokenStore.isEnforcementEnabled || 
        tokenStore.enforcementMode === TokenEnforcementMode.Never) {
      return true;
    }
    
    // If mode is 'warn', allow but will warn
    if (tokenStore.enforcementMode === TokenEnforcementMode.Warn) {
      return true;
    }
    
    return tokenStore.balance >= amount;
  };
  
  // Function to handle token spending with error handling
  const handleSpendTokens = async (amount = 1) => {
    // If token enforcement is disabled, allow the operation
    if (!features.tokenEnforcement || !tokenStore.isEnforcementEnabled || 
        tokenStore.enforcementMode === TokenEnforcementMode.Never) {
      return true;
    }
    
    if (!user) {
      toast.error('You must be logged in to use this feature');
      return false;
    }
    
    if (!hasEnoughTokens(amount) && tokenStore.enforcementMode !== TokenEnforcementMode.Warn) {
      toast.error(`Not enough tokens. You need ${amount} tokens for this operation.`);
      return false;
    }
    
    try {
      const success = await tokenStore.spendTokens(amount);
      if (!success && tokenStore.enforcementMode !== TokenEnforcementMode.Warn) {
        toast.error('Failed to process tokens. Please try again.');
      }
      return success || tokenStore.enforcementMode === TokenEnforcementMode.Warn;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Error spending tokens:', error);
      toast.error(`Error processing tokens: ${errorMessage}`);
      return tokenStore.enforcementMode === TokenEnforcementMode.Warn; // Allow operation to proceed if in warn mode
    }
  };
  
  return {
    tokenBalance: tokenStore.balance,
    enforcementMode: tokenStore.enforcementMode,
    isTokenEnforcementEnabled: features.tokenEnforcement && tokenStore.isEnforcementEnabled,
    tokensPerQuery: tokenStore.tokensPerQuery,
    freeQueryLimit: tokenStore.freeQueryLimit,
    queriesUsed: tokenStore.queriesUsed,
    isLoading,
    error,
    addTokens: tokenStore.addTokens,
    spendTokens: handleSpendTokens,
    setTokenBalance: tokenStore.setTokenBalance,
    hasEnoughTokens,
    setEnforcementMode: tokenStore.setEnforcementMode,
    toggleTokenEnforcement: () => {
      setFeatureState('tokenEnforcement', !features.tokenEnforcement);
      tokenStore.setEnforcementEnabled(!tokenStore.isEnforcementEnabled);
    }
  };
}

// Export the error boundary wrapper for token-related components
export { withTokenErrorBoundary };
