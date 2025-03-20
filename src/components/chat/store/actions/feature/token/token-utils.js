import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
/**
 * Update a user's token balance in the database
 */
export const updateUserTokens = async (userId, newBalance) => {
    try {
        const { error } = await supabase
            .from('user_tokens')
            .upsert({
            user_id: userId,
            balance: newBalance,
            last_updated: new Date().toISOString()
        }, { onConflict: 'user_id' });
        if (error) {
            logger.error('Error updating user tokens:', error);
            return false;
        }
        return true;
    }
    catch (error) {
        logger.error('Error in updateUserTokens:', error);
        return false;
    }
};
/**
 * Log a token transaction for auditing
 */
export const logTokenTransaction = async (userId, amount, type, description) => {
    try {
        const { error } = await supabase
            .from('token_transaction_log')
            .insert({
            user_id: userId,
            amount,
            transaction_type: type,
            description,
            created_at: new Date().toISOString()
        });
        if (error) {
            logger.error('Error logging token transaction:', error);
            return false;
        }
        return true;
    }
    catch (error) {
        logger.error('Error in logTokenTransaction:', error);
        return false;
    }
};
