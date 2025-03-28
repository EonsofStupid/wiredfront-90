
import { create } from 'zustand';
import { TokenState } from './types';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { UIEnforcementMode, TokenEnforcementMode, databaseEnforcementToUiEnforcement } from '@/types/chat/enums';

const initialState: Omit<TokenState, 'addTokens' | 'spendTokens' | 'setTokenBalance' | 'setEnforcementMode' | 'setEnforcementEnabled' | 'resetTokens'> = {
  balance: 0,
  lastUpdated: new Date().toISOString(),
  tokensPerQuery: 1,
  queriesUsed: 0,
  freeQueryLimit: 5,
  enforcementMode: 'never',
  enforcementEnabled: false
};

export const useTokenStore = create<TokenState>((set, get) => ({
  ...initialState,
  
  addTokens: async (amount: number) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        logger.error('Cannot add tokens: User not authenticated');
        return false;
      }
      
      const { data, error } = await supabase.rpc('add_tokens', {
        user_uuid: userData.user.id,
        token_amount: amount
      });
      
      if (error) {
        logger.error('Failed to add tokens', { error });
        return false;
      }
      
      set({ 
        balance: data as number,
        lastUpdated: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      logger.error('Error adding tokens', { error });
      return false;
    }
  },
  
  spendTokens: async (amount: number) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        logger.error('Cannot spend tokens: User not authenticated');
        return false;
      }
      
      // Fetch current balance to check if sufficient before trying to spend
      const { data: tokenData, error: fetchError } = await supabase
        .from('user_tokens')
        .select('balance')
        .eq('user_id', userData.user.id)
        .single();
      
      if (fetchError || !tokenData) {
        logger.error('Failed to fetch token balance', { error: fetchError });
        return false;
      }
      
      if (tokenData.balance < amount) {
        logger.warn('Insufficient tokens', { 
          balance: tokenData.balance, 
          attempted: amount 
        });
        return false;
      }
      
      const { data, error } = await supabase.rpc('spend_tokens', {
        user_uuid: userData.user.id,
        token_amount: amount
      });
      
      if (error) {
        logger.error('Failed to spend tokens', { error });
        return false;
      }
      
      set({ 
        balance: data as number,
        queriesUsed: get().queriesUsed + 1,
        lastUpdated: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      logger.error('Error spending tokens', { error });
      return false;
    }
  },
  
  setTokenBalance: async (balance: number) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        logger.error('Cannot set token balance: User not authenticated');
        return false;
      }
      
      const { error } = await supabase
        .from('user_tokens')
        .upsert({
          user_id: userData.user.id,
          balance: balance,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        logger.error('Failed to set token balance', { error });
        return false;
      }
      
      set({ 
        balance,
        lastUpdated: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      logger.error('Error setting token balance', { error });
      return false;
    }
  },
  
  setEnforcementMode: (mode: UIEnforcementMode) => {
    logger.info('Setting token enforcement mode', { mode });
    set({ enforcementMode: mode });
  },
  
  setEnforcementEnabled: (enabled: boolean) => {
    logger.info('Setting token enforcement enabled', { enabled });
    set({ enforcementEnabled: enabled });
  },
  
  resetTokens: () => {
    logger.info('Resetting token store');
    set({ ...initialState });
  }
}));

export const clearTokenStore = () => {
  useTokenStore.setState({ ...initialState });
};
