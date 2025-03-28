
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { TokenEnforcementMode } from '@/types/chat/enums';
import { EnumUtils } from '@/lib/enums';

/**
 * Update user tokens in the database
 * @param amount Amount to update (positive to add, negative to spend, or direct set if isDirectSet=true)
 * @param isDirectSet If true, sets the balance directly instead of adding/subtracting
 */
export const updateUserTokens = async (
  amount: number, 
  isDirectSet: boolean = false
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      logger.warn('No authenticated user found when updating tokens');
      return false;
    }

    if (isDirectSet) {
      // For direct setting of balance
      const { error } = await supabase.from('user_tokens')
        .upsert({ 
          user_id: user.id, 
          balance: amount 
        });
      
      if (error) throw error;
    } else {
      // For adding or spending tokens
      const { data, error } = await supabase
        .from('user_tokens')
        .select('balance')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      // If no record exists, create one
      if (!data) {
        const initialBalance = Math.max(0, amount); // Don't allow negative balances for new users
        const { error: insertError } = await supabase
          .from('user_tokens')
          .insert({ 
            user_id: user.id, 
            balance: initialBalance 
          });
        
        if (insertError) throw insertError;
      } else {
        // Update existing balance
        const newBalance = Math.max(0, data.balance + amount); // Don't allow negative balances
        const { error: updateError } = await supabase
          .from('user_tokens')
          .update({ 
            balance: newBalance,
            updated_at: new Date().toISOString() 
          })
          .eq('user_id', user.id);
        
        if (updateError) throw updateError;
      }
    }
    
    return true;
  } catch (error) {
    logger.error('Error updating user tokens', { error, amount });
    return false;
  }
};

/**
 * Log a token transaction
 * @param amount Amount of tokens
 * @param type Transaction type (add, spend, set)
 * @param description Optional description
 * @param metadata Optional metadata
 */
export const logTokenTransaction = async (
  amount: number, 
  type: 'add' | 'spend' | 'set', 
  description: string = '',
  metadata: Record<string, any> = {}
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      logger.warn('No authenticated user found when logging token transaction');
      return false;
    }

    const { error } = await supabase.from('token_transactions')
      .insert({
        user_id: user.id,
        amount: type === 'spend' ? -Math.abs(amount) : Math.abs(amount),
        transaction_type: type,
        description: description || `Tokens ${type === 'add' ? 'added' : type === 'spend' ? 'spent' : 'set'}`,
        metadata: {
          source: 'token_store',
          timestamp: new Date().toISOString(),
          ...metadata
        }
      });
    
    if (error) {
      logger.error('Error logging token transaction', { error });
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error logging token transaction', { error, amount, type });
    return false;
  }
};
