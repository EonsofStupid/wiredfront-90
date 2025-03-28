
import { TokenState, SetState, GetState } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { UIEnforcementMode } from '../../../types';

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
    setEnforcementMode: (mode: UIEnforcementMode) => {
      logger.info('Setting token enforcement mode', { mode });
      
      set({
        enforcementMode: mode,
        enforcementEnabled: mode !== 'never', // Enable enforcement if not "never"
        isEnforcementEnabled: mode !== 'never'
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
        // If enabling enforcement, set mode to 'warn' if it was 'never'
        enforcementMode: enabled && get().enforcementMode === 'never' ? 'warn' : get().enforcementMode
      });
    },
    
    /**
     * Reset the token balance
     */
    resetTokens: () => {
      logger.info('Resetting token balance');
      
      set({
        balance: 0,
        lastUpdated: new Date().toISOString()
      });
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
    }
  };
};
