import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { updateUserTokens, logTokenTransaction } from './token-utils';
/**
 * Action to spend tokens from a user's balance
 */
export const spendTokensAction = async (amount, set, get) => {
    try {
        // Check if token enforcement is disabled
        if (!get().features.tokenEnforcement) {
            return true; // Allow operation without spending tokens when disabled
        }
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user)
            return false;
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
            set((state) => ({
                ...state,
                tokenControl: {
                    ...state.tokenControl,
                    balance: newBalance,
                    lastUpdated: new Date().toISOString(),
                    queriesUsed: state.tokenControl.queriesUsed + 1
                }
            }), false, { type: 'tokens/spend', amount });
        }
        return success;
    }
    catch (error) {
        logger.error('Error spending tokens:', error);
        return false;
    }
};
