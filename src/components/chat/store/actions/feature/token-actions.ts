
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { FeatureActions, SetState, GetState } from './types';
import { ChatState } from '../../types/chat-store-types';
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';

// Helper function to update user token balance
export const updateUserTokens = async (userId: string, amount: number): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_tokens')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      logger.error('Error fetching user tokens:', error);
      return false;
    }
    
    if (!data) {
      // Create new token record if it doesn't exist
      const { error: insertError } = await supabase
        .from('user_tokens')
        .insert({ user_id: userId, balance: amount });
      
      if (insertError) {
        logger.error('Error creating user tokens:', insertError);
        return false;
      }
    } else {
      // Update existing token record
      const { error: updateError } = await supabase
        .from('user_tokens')
        .update({ balance: amount })
        .eq('user_id', userId);
      
      if (updateError) {
        logger.error('Error updating user tokens:', updateError);
        return false;
      }
    }
    
    // Log this transaction for auditing
    await supabase.from('token_transaction_log').insert({
      user_id: userId,
      amount: amount,
      transaction_type: 'update',
      description: 'Balance updated manually',
      metadata: { source: 'client_app' }
    });
    
    return true;
  } catch (error) {
    logger.error('Error in updateUserTokens:', error);
    return false;
  }
};

// Helper function to log token transactions
export const logTokenTransaction = async (
  userId: string,
  amount: number,
  type: 'add' | 'spend' | 'set',
  description: string = ''
): Promise<boolean> => {
  try {
    // Insert transaction record
    const { error } = await supabase.from('token_transaction_log').insert({
      user_id: userId,
      amount: amount,
      transaction_type: type,
      description,
      metadata: { source: 'client_app' }
    });
    
    if (error) {
      logger.error('Error logging token transaction:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error in logTokenTransaction:', error);
    return false;
  }
};

// Token management actions
export const createTokenActions = (
  set: SetState<ChatState>, 
  get: GetState<ChatState>
): Pick<FeatureActions, 'setTokenEnforcementMode' | 'addTokens' | 'spendTokens' | 'setTokenBalance'> => ({
  setTokenEnforcementMode: (mode: TokenEnforcementMode) =>
    set(
      (state: ChatState) => ({
        ...state,
        tokenControl: {
          ...state.tokenControl,
          enforcementMode: mode
        }
      }),
      false,
      { type: 'tokens/setEnforcementMode', mode }
    ),
  
  addTokens: async (amount: number) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return false;
      
      const userId = userData.user.id;
      const currentBalance = get().tokenControl.balance;
      const newBalance = currentBalance + amount;
      
      const success = await updateUserTokens(userId, newBalance);
      
      if (success) {
        // Log the transaction
        await logTokenTransaction(userId, amount, 'add', 'Tokens added to balance');
        
        set(
          (state: ChatState) => ({
            ...state,
            tokenControl: {
              ...state.tokenControl,
              balance: newBalance,
              lastUpdated: new Date().toISOString()
            }
          }),
          false,
          { type: 'tokens/add', amount }
        );
      }
      
      return success;
    } catch (error) {
      logger.error('Error adding tokens:', error);
      return false;
    }
  },
  
  spendTokens: async (amount: number) => {
    try {
      // Check if token enforcement is disabled
      if (!get().features.tokenEnforcement) {
        return true; // Allow operation without spending tokens when disabled
      }
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return false;
      
      const userId = userData.user.id;
      const currentBalance = get().tokenControl.balance;
      
      // Check if user has enough tokens
      if (currentBalance < amount) {
        return false;
      }
      
      const newBalance = currentBalance - amount;
      const success = await updateUserTokens(userId, newBalance);
      
      if (success) {
        // Log the transaction
        await logTokenTransaction(userId, amount, 'spend', 'Tokens spent on operation');
        
        set(
          (state: ChatState) => ({
            ...state,
            tokenControl: {
              ...state.tokenControl,
              balance: newBalance,
              lastUpdated: new Date().toISOString(),
              queriesUsed: state.tokenControl.queriesUsed + 1
            }
          }),
          false,
          { type: 'tokens/spend', amount }
        );
      }
      
      return success;
    } catch (error) {
      logger.error('Error spending tokens:', error);
      return false;
    }
  },
  
  setTokenBalance: async (amount: number) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return false;
      
      const userId = userData.user.id;
      const currentBalance = get().tokenControl.balance;
      const success = await updateUserTokens(userId, amount);
      
      if (success) {
        // Log the transaction
        await logTokenTransaction(
          userId, 
          amount - currentBalance, 
          'set', 
          'Token balance set manually'
        );
        
        set(
          (state: ChatState) => ({
            ...state,
            tokenControl: {
              ...state.tokenControl,
              balance: amount,
              lastUpdated: new Date().toISOString()
            }
          }),
          false,
          { type: 'tokens/setBalance', amount }
        );
      }
      
      return success;
    } catch (error) {
      logger.error('Error setting token balance:', error);
      return false;
    }
  }
});
