
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';

/**
 * Update user tokens in the database
 */
export const updateUserTokens = async (amount: number, isDirectSet: boolean = false): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No authenticated user');
    }

    if (isDirectSet) {
      // For direct setting of balance
      const { error } = await supabase.rpc('set_token_balance', {
        user_uuid: user.id,
        token_amount: amount
      });
      
      if (error) throw error;
    } else if (amount > 0) {
      // For adding tokens
      const { error } = await supabase.rpc('add_tokens', {
        user_uuid: user.id,
        token_amount: amount
      });
      
      if (error) throw error;
    } else if (amount < 0) {
      // For spending tokens
      const { error } = await supabase.rpc('spend_tokens', {
        user_uuid: user.id,
        token_amount: Math.abs(amount)
      });
      
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    logger.error('Error updating user tokens', { error, amount });
    return false;
  }
};

/**
 * Log a token transaction
 */
export const logTokenTransaction = async (
  amount: number, 
  type: 'add' | 'spend' | 'set', 
  description: string = ''
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No authenticated user');
    }

    const { error } = await supabase.from('token_transactions').insert({
      user_id: user.id,
      amount,
      transaction_type: type,
      description: description || `Tokens ${type === 'add' ? 'added' : type === 'spend' ? 'spent' : 'set'} via API`,
      metadata: {
        source: 'chat_bridge',
        timestamp: new Date().toISOString()
      }
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    logger.error('Error logging token transaction', { error, amount, type });
    return false;
  }
};
