
import { useEffect, useMemo } from 'react';
import { useTokenStore, useTokenBalance, useTokenEnforcementMode, useTokenUsage } from '@/stores/features/tokens/store';
import { supabase } from '@/integrations/supabase/client';
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';
import { logger } from '@/services/chat/LoggingService';
import { useAuthStore } from '@/stores/auth/store';
import { toast } from 'sonner';

/**
 * Hook for managing token balance and enforcement
 */
export function useTokenManagement() {
  const { balance, enforcementMode, isLoading, error, setBalance, setEnforcementMode } = useTokenStore();
  const tokenUsage = useTokenUsage();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  // Check if token enforcement is enabled
  const isTokenEnforcementEnabled = useMemo(() => {
    return enforcementMode !== 'never';
  }, [enforcementMode]);
  
  // Load token info on mount if authenticated
  useEffect(() => {
    const fetchTokenInfo = async () => {
      if (!isAuthenticated) return;
      
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        // Get token info from Supabase
        const { data, error } = await supabase
          .from('user_tokens')
          .select('balance, enforcement_mode')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error
            throw error;
          }
          // If not found, create a new record
          return;
        }
        
        if (data) {
          setBalance(data.balance || 0);
          setEnforcementMode(data.enforcement_mode as TokenEnforcementMode || 'never');
        }
      } catch (error) {
        logger.error('Error fetching token info', { error });
      }
    };
    
    fetchTokenInfo();
  }, [isAuthenticated, setBalance, setEnforcementMode]);
  
  /**
   * Check if user has sufficient tokens to use a feature
   */
  const checkTokenAvailability = (requiredTokens: number = 1): boolean => {
    if (!isTokenEnforcementEnabled) return true;
    
    // If free tier and under limit, allow
    if (enforcementMode === 'free_tier' && tokenUsage.queriesUsed < tokenUsage.freeQueryLimit) {
      return true;
    }
    
    // Check if user has enough tokens
    return balance >= requiredTokens;
  };
  
  /**
   * Consume tokens for a feature
   * @returns Promise<boolean> True if tokens were successfully consumed
   */
  const consumeTokens = async (amount: number = 1): Promise<boolean> => {
    if (!isTokenEnforcementEnabled) return true;
    
    // If free tier and under limit, don't consume tokens
    if (enforcementMode === 'free_tier' && tokenUsage.queriesUsed < tokenUsage.freeQueryLimit) {
      useTokenStore.getState().resetUsage();
      return true;
    }
    
    try {
      const success = await useTokenStore.getState().spendTokens(amount);
      
      if (!success) {
        toast.error('Insufficient tokens available');
      }
      
      return success;
    } catch (error) {
      logger.error('Error consuming tokens', { error, amount });
      toast.error('Failed to process tokens');
      return false;
    }
  };
  
  return {
    // State
    tokenBalance: balance,
    enforcementMode,
    isTokenEnforcementEnabled,
    isLoading,
    error,
    tokenUsage,
    
    // Actions
    checkTokenAvailability,
    consumeTokens,
    addTokens: useTokenStore(state => state.addTokens),
    setEnforcementMode
  };
}
