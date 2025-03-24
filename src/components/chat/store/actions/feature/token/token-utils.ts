
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';

/**
 * Updates a user's token balance in the database
 */
export const updateUserTokens = async (
  userId: string,
  newBalance: number
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_tokens')
      .upsert({
        user_id: userId,
        balance: newBalance,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    logger.error('Error updating user tokens:', error);
    return false;
  }
};

/**
 * Logs a token transaction to the database
 */
export const logTokenTransaction = async (
  userId: string,
  amount: number,
  transactionType: 'add' | 'spend' | 'set' | 'reset',
  description: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('token_transactions')
      .insert({
        user_id: userId,
        amount: amount,
        transaction_type: transactionType,
        description: description
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    logger.error('Error logging token transaction:', error);
    return false;
  }
};
