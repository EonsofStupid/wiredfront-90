
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
    const { error } = await supabase.from('user_tokens').upsert({
      user_id: userId,
      balance: newBalance,
      last_updated: new Date().toISOString()
    }, { onConflict: 'user_id' });
    
    if (error) {
      logger.error('Error updating user tokens:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error in updateUserTokens:', error);
    return false;
  }
};

/**
 * Logs a token transaction to the database
 */
export const logTokenTransaction = async (
  userId: string,
  amount: number,
  transactionType: 'add' | 'spend' | 'set',
  description: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.from('token_transaction_log').insert({
      user_id: userId,
      amount,
      transaction_type: transactionType,
      description,
      metadata: { timestamp: new Date().toISOString() }
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
