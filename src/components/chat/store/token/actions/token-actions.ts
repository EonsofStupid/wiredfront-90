
import { TokenState, SetState, GetState } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { TokenEnforcementMode } from '@/types/chat/tokens';
import { toJson } from '@/utils/json';

/**
 * Create actions for the token store
 */
export const createTokenActions = (
  set: SetState<TokenState>,
  get: GetState<TokenState>
) => {
  return {
    /**
     * Add tokens to the user's balance
     */
    addTokens: async (amount: number): Promise<boolean> => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          throw new Error('User not authenticated');
        }
        
        const currentBalance = get().balance;
        const newBalance = currentBalance + amount;
        
        // Update the database
        const { error } = await supabase
          .from('user_tokens')
          .upsert({
            user_id: userData.user.id,
            balance: newBalance,
            updated_at: new Date().toISOString()
          });
        
        if (error) {
          throw error;
        }
        
        // Update the store
        set({
          balance: newBalance,
          lastUpdated: new Date().toISOString()
        });
        
        logger.info('Added tokens', { amount, newBalance });
        
        return true;
      } catch (error) {
        logger.error('Failed to add tokens', { error, amount });
        return false;
      }
    },
    
    /**
     * Spend tokens from the user's balance
     */
    spendTokens: async (amount: number): Promise<boolean> => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          throw new Error('User not authenticated');
        }
        
        const currentBalance = get().balance;
        
        // Check if user has enough tokens
        if (currentBalance < amount) {
          logger.warn('Insufficient tokens', { currentBalance, requestedAmount: amount });
          return false;
        }
        
        const newBalance = currentBalance - amount;
        
        // Update the database
        const { error } = await supabase
          .from('user_tokens')
          .upsert({
            user_id: userData.user.id,
            balance: newBalance,
            updated_at: new Date().toISOString()
          });
        
        if (error) {
          throw error;
        }
        
        // Update the store
        set({
          balance: newBalance,
          lastUpdated: new Date().toISOString(),
          queriesUsed: get().queriesUsed + 1
        });
        
        logger.info('Spent tokens', { amount, newBalance });
        
        return true;
      } catch (error) {
        logger.error('Failed to spend tokens', { error, amount });
        return false;
      }
    },
    
    /**
     * Set the token balance to a specific value
     */
    setTokenBalance: async (balance: number): Promise<boolean> => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          throw new Error('User not authenticated');
        }
        
        // Update the database
        const { error } = await supabase
          .from('user_tokens')
          .upsert({
            user_id: userData.user.id,
            balance,
            updated_at: new Date().toISOString()
          });
        
        if (error) {
          throw error;
        }
        
        // Update the store
        set({
          balance,
          lastUpdated: new Date().toISOString()
        });
        
        logger.info('Set token balance', { balance });
        
        return true;
      } catch (error) {
        logger.error('Failed to set token balance', { error, balance });
        return false;
      }
    },
    
    /**
     * Set the enforcement mode
     */
    setEnforcementMode: (mode: TokenEnforcementMode) => {
      logger.info('Setting token enforcement mode', { mode });
      
      set({
        enforcementMode: mode,
        enforcementEnabled: mode !== TokenEnforcementMode.None, // Enable enforcement if not "none"
        isEnforcementEnabled: mode !== TokenEnforcementMode.None
      });
    },
    
    /**
     * Set whether token enforcement is enabled
     */
    setEnforcementEnabled: (enabled: boolean) => {
      logger.info('Setting token enforcement enabled', { enabled });
      
      set({
        enforcementEnabled: enabled,
        isEnforcementEnabled: enabled,
        // If enabling enforcement, set mode to 'warn' if it was 'none'
        enforcementMode: enabled && get().enforcementMode === TokenEnforcementMode.None 
          ? TokenEnforcementMode.Warn 
          : get().enforcementMode
      });
    },
    
    /**
     * Reset the token balance
     */
    resetTokens: async (): Promise<boolean> => {
      logger.info('Resetting token balance');
      
      set({
        balance: 0,
        lastUpdated: new Date().toISOString()
      });
      
      return true;
    },
    
    /**
     * Reset the queries used counter
     */
    resetQueriesUsed: () => {
      logger.info('Resetting queries used counter');
      
      set({
        queriesUsed: 0
      });
    },
    
    /**
     * Update token settings
     */
    updateTokenSettings: (settings: Partial<TokenState>) => {
      logger.info('Updating token settings', { settings });
      
      set({ ...settings });
    },
    
    /**
     * Initialize token data
     */
    initialize: async (): Promise<void> => {
      // Implementation of initialize would fetch initial token data
      logger.info('Initializing token data');
    },
    
    /**
     * Fetch token data from the database
     */
    fetchTokenData: async (): Promise<void> => {
      // Implementation of fetchTokenData would refresh token data from DB
      logger.info('Fetching token data');
    },
    
    /**
     * Set token warning threshold
     */
    setWarningThreshold: (percent: number) => {
      logger.info('Setting token warning threshold', { percent });
      
      set({ warningThreshold: percent });
    },
    
    /**
     * Set token reset date
     */
    setResetDate: (date: string | null) => {
      logger.info('Setting token reset date', { date });
      
      set({ resetDate: date });
    },
    
    /**
     * Set token balance
     */
    setBalance: (amount: number) => {
      logger.info('Setting token balance directly', { amount });
      
      set({ balance: amount });
    },
    
    /**
     * Set token amount (alias for setTokenBalance for backward compatibility)
     */
    setTokens: async (amount: number, reason?: string): Promise<boolean> => {
      return await get().setTokenBalance(amount);
    }
  };
};
