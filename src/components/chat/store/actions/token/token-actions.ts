
import { Token, TokenState } from '@/types/chat/token';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { TokenEnforcementMode } from '@/types/chat/enums';
import { toJson } from '@/utils/json';

/**
 * Creates token-related store actions
 */
export const createTokenActions = (set: any, get: any) => {
  return {
    /**
     * Initialize token state
     */
    initializeTokens: async () => {
      try {
        set({ isLoading: true, error: null });
        
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          throw new Error('No user found');
        }
        
        const { data, error } = await supabase
          .from('user_tokens')
          .select('*')
          .eq('user_id', userData.user.id)
          .single();
        
        if (error) {
          // If no token record exists, create one
          if (error.code === 'PGRST116') {
            const newToken: Token = {
              id: crypto.randomUUID(),
              user_id: userData.user.id,
              balance: 1000, // Default starting balance
              used: 0,
              limit: 2000, // Default limit
              reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
              enforcement_mode: TokenEnforcementMode.Warn,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              metadata: {}
            };
            
            const { data: newTokenData, error: createError } = await supabase
              .from('user_tokens')
              .insert(newToken)
              .select()
              .single();
            
            if (createError) {
              throw createError;
            }
            
            set({
              id: newTokenData.id,
              balance: newTokenData.balance,
              used: newTokenData.used,
              limit: newTokenData.limit,
              resetDate: newTokenData.reset_date,
              enforcementMode: newTokenData.enforcement_mode,
              isLoading: false,
              usagePercent: 0,
              isLowBalance: false
            });
            
            return;
          }
          
          throw error;
        }
        
        const usagePercent = data.limit > 0 ? Math.round((data.used / data.limit) * 100) : 0;
        const isLowBalance = data.balance <= 100 || usagePercent >= 90;
        
        set({
          id: data.id,
          balance: data.balance,
          used: data.used,
          limit: data.limit,
          resetDate: data.reset_date,
          enforcementMode: data.enforcement_mode,
          isLoading: false,
          usagePercent,
          isLowBalance
        });
        
        logger.info('Token state initialized', { 
          balance: data.balance, 
          used: data.used,
          limit: data.limit,
          usagePercent 
        });
      } catch (error) {
        logger.error('Failed to initialize token state', error);
        set({ 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to load token data',
          usagePercent: 0,
          isLowBalance: false
        });
      }
    },
    
    /**
     * Update token balance
     */
    updateBalance: async (amount: number) => {
      try {
        const state = get();
        const newBalance = state.balance + amount;
        
        // Update in local state first for immediate feedback
        set({ 
          balance: newBalance,
          usagePercent: state.limit > 0 ? Math.round((state.used / state.limit) * 100) : 0,
          isLowBalance: newBalance <= 100 || (state.limit > 0 && ((state.used / state.limit) * 100) >= 90)
        });
        
        // Then update in the database
        if (state.id) {
          const { error } = await supabase
            .from('user_tokens')
            .update({ 
              balance: newBalance,
              updated_at: new Date().toISOString()
            })
            .eq('id', state.id);
          
          if (error) {
            throw error;
          }
          
          logger.info('Token balance updated', { oldBalance: state.balance, newBalance });
        }
      } catch (error) {
        logger.error('Failed to update token balance', error);
        set({ 
          error: error instanceof Error ? error.message : 'Failed to update token balance'
        });
      }
    },
    
    /**
     * Update tokens used
     */
    updateUsed: async (amount: number) => {
      try {
        const state = get();
        const newUsed = state.used + amount;
        
        // Calculate usage statistics
        const usagePercent = state.limit > 0 ? Math.round((newUsed / state.limit) * 100) : 0;
        const isLowBalance = state.balance <= 100 || usagePercent >= 90;
        
        // Update in local state first for immediate feedback
        set({ 
          used: newUsed,
          usagePercent,
          isLowBalance
        });
        
        // Then update in the database
        if (state.id) {
          const { error } = await supabase
            .from('user_tokens')
            .update({ 
              used: newUsed,
              updated_at: new Date().toISOString()
            })
            .eq('id', state.id);
          
          if (error) {
            throw error;
          }
          
          logger.info('Tokens used updated', { 
            oldUsed: state.used, 
            newUsed,
            usagePercent
          });
        }
      } catch (error) {
        logger.error('Failed to update tokens used', error);
        set({ 
          error: error instanceof Error ? error.message : 'Failed to update tokens used'
        });
      }
    },
    
    /**
     * Update enforcement mode
     */
    updateEnforcementMode: async (mode: TokenEnforcementMode) => {
      try {
        // Update in local state first for immediate feedback
        set({ enforcementMode: mode });
        
        // Then update in the database
        const state = get();
        if (state.id) {
          const { error } = await supabase
            .from('user_tokens')
            .update({ 
              enforcement_mode: mode,
              updated_at: new Date().toISOString()
            })
            .eq('id', state.id);
          
          if (error) {
            throw error;
          }
          
          logger.info('Token enforcement mode updated', { 
            oldMode: state.enforcementMode, 
            newMode: mode 
          });
        }
      } catch (error) {
        logger.error('Failed to update token enforcement mode', error);
        set({ 
          error: error instanceof Error ? error.message : 'Failed to update token enforcement mode'
        });
      }
    },
    
    /**
     * Reset token data (used and balance)
     */
    resetTokens: async () => {
      try {
        const state = get();
        
        // Prepare reset data
        const resetData = {
          balance: 1000, // Default starting balance
          used: 0,
          reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          updated_at: new Date().toISOString()
        };
        
        // Update in local state first for immediate feedback
        set({ 
          balance: resetData.balance,
          used: resetData.used,
          resetDate: resetData.reset_date,
          usagePercent: 0,
          isLowBalance: false
        });
        
        // Then update in the database
        if (state.id) {
          const { error } = await supabase
            .from('user_tokens')
            .update(resetData)
            .eq('id', state.id);
          
          if (error) {
            throw error;
          }
          
          logger.info('Token data reset');
        }
      } catch (error) {
        logger.error('Failed to reset token data', error);
        set({ 
          error: error instanceof Error ? error.message : 'Failed to reset token data'
        });
      }
    }
  };
};
