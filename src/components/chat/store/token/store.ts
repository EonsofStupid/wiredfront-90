
import { create } from 'zustand';
import { TokenState } from './types';
import { createTokenActions } from './actions/token-actions';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { TokenEnforcementMode } from '@/types/chat/enums';

const initialState: Omit<TokenState, 'addTokens' | 'spendTokens' | 'setTokenBalance' | 'setEnforcementMode' | 'setEnforcementEnabled' | 'resetTokens' | 'resetQueriesUsed' | 'updateTokenSettings'> = {
  balance: 0,
  lastUpdated: new Date().toISOString(),
  tokensPerQuery: 1,
  queriesUsed: 0,
  freeQueryLimit: 5,
  enforcementMode: TokenEnforcementMode.Never,
  enforcementEnabled: false,
  isEnforcementEnabled: false
};

export const useTokenStore = create<TokenState>((set, get) => {
  // Create token actions with our store's set and get functions
  const tokenActions = createTokenActions(set, get);
  
  return {
    ...initialState,
    ...tokenActions
  };
});

/**
 * Clear token store state
 * Used for logout and testing
 */
export const clearTokenStore = () => {
  useTokenStore.setState({ ...initialState });
};

/**
 * Fetch token balance from the database
 * Can be used to refresh the token balance
 */
export const fetchTokenBalance = async (): Promise<number | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      logger.warn('No authenticated user found when fetching token balance');
      return null;
    }
    
    const { data, error } = await supabase
      .from('user_tokens')
      .select('balance')
      .eq('user_id', userData.user.id)
      .single();
    
    if (error) {
      logger.error('Failed to fetch token balance', { error });
      return null;
    }
    
    if (data) {
      useTokenStore.setState({ 
        balance: data.balance,
        lastUpdated: new Date().toISOString()
      });
      return data.balance;
    }
    
    return null;
  } catch (error) {
    logger.error('Error fetching token balance', { error });
    return null;
  }
};
