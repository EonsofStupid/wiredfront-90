
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { ChatState } from '../../../types/chat-store-types';
import { SetState, GetState } from '../types';
import { updateUserTokens, logTokenTransaction } from './token-utils';
import { toast } from 'sonner';

/**
 * Action to add tokens to the user's balance
 */
export const addTokensAction = async (
  amount: number,
  set: SetState<ChatState>,
  get: GetState<ChatState>
): Promise<boolean> => {
  try {
    // Get the current auth user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      toast.error('You must be logged in to add tokens');
      return false;
    }
    
    const userId = userData.user.id;
    const currentBalance = get().tokenControl.balance;
    const newBalance = currentBalance + amount;
    
    // Update in database
    const success = await updateUserTokens(userId, newBalance);
    if (!success) {
      toast.error('Failed to add tokens');
      return false;
    }
    
    // Log the transaction
    await logTokenTransaction(
      userId,
      amount,
      'add',
      'Tokens added',
      { previous_balance: currentBalance }
    );
    
    // Update in store
    set(state => ({
      tokenControl: {
        ...state.tokenControl,
        balance: newBalance,
        lastUpdated: new Date().toISOString()
      }
    }), false, { type: 'tokens/add', amount, newBalance });
    
    toast.success(`Added ${amount} tokens to your account`);
    logger.info('Tokens added', { userId, amount, newBalance });
    
    return true;
  } catch (error) {
    logger.error('Failed to add tokens', { error, amount });
    toast.error('Failed to add tokens');
    return false;
  }
};
