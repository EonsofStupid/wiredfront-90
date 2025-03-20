import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { updateUserTokens, logTokenTransaction } from './token-utils';
/**
 * Action to set a user's token balance to a specific amount
 */
export const setTokenBalanceAction = async (amount, set, get) => {
    try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user)
            return false;
        const userId = userData.user.id;
        const currentBalance = get().tokenControl.balance;
        const success = await updateUserTokens(userId, amount);
        if (success) {
            // Log the transaction
            await logTokenTransaction(userId, amount - currentBalance, 'set', 'Token balance set manually');
            set((state) => ({
                ...state,
                tokenControl: {
                    ...state.tokenControl,
                    balance: amount,
                    lastUpdated: new Date().toISOString()
                }
            }), false, { type: 'tokens/setBalance', amount });
        }
        return success;
    }
    catch (error) {
        logger.error('Error setting token balance:', error);
        return false;
    }
};
