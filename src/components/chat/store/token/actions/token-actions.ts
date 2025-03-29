
import { TokenState, SetState, GetState } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { TokenEnforcementMode } from '@/types/chat/enums';
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
    addTokens: async (amount: number, reason?: string): Promise<boolean> => {
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
        
        logger.info('Added tokens', { amount, newBalance, reason });
        
        return true;
      } catch (error) {
        logger.error('Failed to add tokens', { error, amount, reason });
        return false;
      }
    },
    
    /**
     * Spend tokens from the user's balance
     */
    spendTokens: async (amount: number, reason?: string): Promise<boolean> => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          throw new Error('User not authenticated');
        }
        
        const currentBalance = get().balance;
        
        // Check if user has enough tokens based on enforcement mode
        if (currentBalance < amount) {
          if (get().enforcementMode === TokenEnforcementMode.Hard) {
            logger.warn('Insufficient tokens for hard enforcement', { 
              currentBalance, 
              requestedAmount: amount 
            });
            return false;
          }
          // In soft or warn mode, we'll continue but log the issue
          logger.warn('Insufficient tokens but allowing due to enforcement mode', {
            currentBalance,
            requestedAmount: amount,
            enforcementMode: get().enforcementMode
          });
        }
        
        const newBalance = Math.max(0, currentBalance - amount);
        
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
        
        logger.info('Spent tokens', { amount, newBalance, reason });
        
        return true;
      } catch (error) {
        logger.error('Failed to spend tokens', { error, amount, reason });
        return false;
      }
    },
    
    /**
     * Set the token balance to a specific value
     */
    setTokenBalance: async (amount: number): Promise<boolean> => {
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
            balance: amount,
            updated_at: new Date().toISOString()
          });
        
        if (error) {
          throw error;
        }
        
        // Update the store
        set({
          balance: amount,
          lastUpdated: new Date().toISOString()
        });
        
        logger.info('Set token balance', { amount });
        
        return true;
      } catch (error) {
        logger.error('Failed to set token balance', { error, amount });
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
        enforcementEnabled: mode !== TokenEnforcementMode.Never, // Enable enforcement if not "none"
        isEnforcementEnabled: mode !== TokenEnforcementMode.Never
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
        enforcementMode: enabled && get().enforcementMode === TokenEnforcementMode.Never 
          ? TokenEnforcementMode.Warn 
          : get().enforcementMode
      });
    },
    
    /**
     * Set tokens (alias for setTokenBalance for compatibility)
     */
    setTokens: async (amount: number, reason?: string): Promise<boolean> => {
      return await get().setTokenBalance(amount);
    },
    
    /**
     * Initialize token data
     */
    initialize: async (): Promise<void> => {
      logger.info('Initializing token data');
      
      try {
        set({ isLoading: true });
        
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          logger.warn('No authenticated user when initializing tokens');
          set({ isLoading: false });
          return;
        }
        
        const { data, error } = await supabase
          .from('user_tokens')
          .select('*')
          .eq('user_id', userData.user.id)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            // No record exists, create default
            logger.info('Creating default token record');
            set({ isLoading: false });
            return;
          }
          throw error;
        }
        
        if (data) {
          set({
            id: data.id,
            balance: data.balance,
            lastUpdated: new Date().toISOString(),
            // Map database fields to our state
            enforcementMode: data.enforcement_mode ? 
              data.enforcement_mode as TokenEnforcementMode : 
              TokenEnforcementMode.Never,
            isLoading: false
          });
        }
      } catch (error) {
        logger.error('Error initializing token data', { error });
        set({ isLoading: false, error: error as Error });
      }
    },
    
    /**
     * Fetch token data from the database
     */
    fetchTokenData: async (): Promise<void> => {
      await get().initialize();
    },
    
    /**
     * Reset token balance
     */
    resetTokens: async (): Promise<boolean> => {
      try {
        const defaultBalance = 1000; // Default balance for reset
        
        set({
          balance: defaultBalance,
          lastUpdated: new Date().toISOString()
        });
        
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          return false;
        }
        
        const { error } = await supabase
          .from('user_tokens')
          .upsert({
            user_id: userData.user.id,
            balance: defaultBalance,
            updated_at: new Date().toISOString()
          });
        
        if (error) {
          throw error;
        }
        
        logger.info('Reset token balance', { newBalance: defaultBalance });
        
        return true;
      } catch (error) {
        logger.error('Failed to reset tokens', { error });
        return false;
      }
    },
    
    /**
     * Reset queries used counter
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
     * Set token balance directly
     */
    setBalance: (amount: number) => {
      logger.info('Setting token balance directly', { amount });
      
      set({ balance: amount });
    }
  };
};
