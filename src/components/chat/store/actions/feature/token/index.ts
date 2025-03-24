
import { ChatState } from '../../../types/chat-store-types';
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';
import { SetState, GetState } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';

// Create token management actions
export const createTokenActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => ({
  setTokenEnforcementMode: (mode: TokenEnforcementMode) => {
    set(
      (state: ChatState) => ({
        ...state,
        tokenControl: {
          ...state.tokenControl,
          enforcementMode: mode,
        },
      }),
      false,
      { type: 'tokens/setEnforcementMode', mode }
    );
  },
  
  addTokens: async (amount: number): Promise<boolean> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return false;
      
      // First, update the tokens in the user_tokens table
      const { error } = await supabase.from('user_tokens').upsert({
        user_id: userData.user.id,
        balance: get().tokenControl.balance + amount,
        total_earned: get().tokenControl.balance + amount // Increment total earned
      });
      
      if (error) throw error;
      
      // Then log the transaction
      await supabase.from('token_transactions').insert({
        user_id: userData.user.id,
        amount,
        transaction_type: 'add',
        description: 'Token added to account'
      });
      
      // Update the local state
      set((state) => ({
        ...state,
        tokenControl: {
          ...state.tokenControl,
          balance: state.tokenControl.balance + amount,
          lastUpdated: new Date().toISOString()
        }
      }));
      
      return true;
    } catch (error) {
      logger.error('Error adding tokens:', error);
      return false;
    }
  },
  
  spendTokens: async (amount: number): Promise<boolean> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return false;
      
      // First, check if user has enough tokens
      if (get().tokenControl.balance < amount) {
        logger.warn('Insufficient tokens to spend', { 
          balance: get().tokenControl.balance, 
          requested: amount 
        });
        return false;
      }
      
      // Update the tokens in the user_tokens table
      const { error } = await supabase.from('user_tokens').upsert({
        user_id: userData.user.id,
        balance: get().tokenControl.balance - amount,
        total_spent: get().tokenControl.balance + amount, // Increment total spent
        queries_used: get().tokenControl.queriesUsed + 1
      });
      
      if (error) throw error;
      
      // Log the transaction
      await supabase.from('token_transactions').insert({
        user_id: userData.user.id,
        amount: -amount, // Negative amount for spending
        transaction_type: 'spend',
        description: 'Token spent on query'
      });
      
      // Update the local state
      set((state) => ({
        ...state,
        tokenControl: {
          ...state.tokenControl,
          balance: state.tokenControl.balance - amount,
          queriesUsed: state.tokenControl.queriesUsed + 1,
          lastUpdated: new Date().toISOString()
        }
      }));
      
      return true;
    } catch (error) {
      logger.error('Error spending tokens:', error);
      return false;
    }
  },
  
  setTokenBalance: async (balance: number): Promise<boolean> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return false;
      
      // Update the tokens in the user_tokens table
      const { error } = await supabase.from('user_tokens').upsert({
        user_id: userData.user.id,
        balance
      });
      
      if (error) throw error;
      
      // Update the local state
      set((state) => ({
        ...state,
        tokenControl: {
          ...state.tokenControl,
          balance,
          lastUpdated: new Date().toISOString()
        }
      }));
      
      return true;
    } catch (error) {
      logger.error('Error setting token balance:', error);
      return false;
    }
  }
});
