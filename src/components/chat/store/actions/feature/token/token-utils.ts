
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';

/**
 * Updates a user's token balance in the database
 */
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

/**
 * Logs token transactions to the database for auditing
 */
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
