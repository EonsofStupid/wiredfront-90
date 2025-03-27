
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';

/**
 * Update user tokens in the database
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
 */
export const logTokenTransaction = async (
  amount: number, 
  type: 'add' | 'spend' | 'set', 
  description: string = ''
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
        amount,
        transaction_type: type,
        description: description || `Tokens ${type === 'add' ? 'added' : type === 'spend' ? 'spent' : 'set'}`,
        metadata: {
          source: 'token_store',
          timestamp: new Date().toISOString()
        }
      });
    
    if (error) {
      // If the table doesn't exist yet, log the error but don't throw
      logger.error('Error logging token transaction - table might not exist', { error });
      return true; // Return true to not break the flow if this is just a logging issue
    }
    
    return true;
  } catch (error) {
    logger.error('Error logging token transaction', { error, amount, type });
    return false; // Only return false for critical errors
  }
};
