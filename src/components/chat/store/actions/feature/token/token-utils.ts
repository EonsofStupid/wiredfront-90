
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';

/**
 * Updates a user's token balance in the database
 */
export async function updateUserTokens(
  userId: string,
  newBalance: number
): Promise<boolean> {
  try {
    // Update the user's token balance
    const { error } = await supabase
      .from('user_tokens')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
    
    if (error) {
      logger.error('Failed to update user tokens', { error, userId, newBalance });
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Exception updating user tokens', { error, userId, newBalance });
    return false;
  }
}

/**
 * Logs a token transaction
 */
export async function logTokenTransaction(
  userId: string,
  amount: number,
  type: 'add' | 'spend',
  description: string = '',
  metadata: Record<string, any> = {}
): Promise<boolean> {
  try {
    // Log the transaction
    const { error } = await supabase
      .from('token_transactions')
      .insert({
        user_id: userId,
        amount: type === 'add' ? amount : -amount,
        transaction_type: type,
        description,
        metadata
      });
    
    if (error) {
      logger.error('Failed to log token transaction', { error, userId, amount, type });
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Exception logging token transaction', { error, userId, amount, type });
    return false;
  }
}
