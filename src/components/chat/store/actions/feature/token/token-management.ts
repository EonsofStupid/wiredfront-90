
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { ChatState } from '../../../types/chat-store-types';
import { SetState, GetState } from '../types';
import { updateUserTokens, logTokenTransaction } from './token-utils';

/**
 * Action to add tokens to a user's balance
 */
export const addTokensAction = async (
  amount: number,
  set: SetState<ChatState>,
  get: GetState<ChatState>
): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return false;
    
    const userId = userData.user.id;
    const currentBalance = get().tokenControl.balance;
    const newBalance = currentBalance + amount;
    
    const success = await updateUserTokens(userId, newBalance);
    
    if (success) {
      // Log the transaction
      await logTokenTransaction(userId, amount, 'add', 'Tokens added to balance');
      
      set(
        (state: ChatState) => ({
          ...state,
          tokenControl: {
            ...state.tokenControl,
            balance: newBalance,
            lastUpdated: new Date().toISOString()
          }
        }),
        false,
        { type: 'tokens/add', amount }
      );
    }
    
    return success;
  } catch (error) {
    logger.error('Error adding tokens:', error);
    return false;
  }
};
