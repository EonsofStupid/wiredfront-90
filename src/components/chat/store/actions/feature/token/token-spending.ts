
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { ChatState } from '../../../types/chat-store-types';
import { SetState, GetState } from '../types';
import { updateUserTokens, logTokenTransaction } from './token-utils';
import { toast } from 'sonner';

/**
 * Action to spend tokens from the user's balance
 */
export const spendTokensAction = async (
  amount: number,
  set: SetState<ChatState>,
  get: GetState<ChatState>
): Promise<boolean> => {
  try {
    // Get the current auth user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      toast.error('You must be logged in to spend tokens');
      return false;
    }
    
    const userId = userData.user.id;
    const currentBalance = get().tokenControl.balance;
    
    // Check if user has enough tokens
    if (currentBalance < amount) {
      toast.error(`Not enough tokens. Current balance: ${currentBalance}`);
      return false;
    }
    
    const newBalance = currentBalance - amount;
    
    // Update in database
    const success = await updateUserTokens(userId, newBalance);
    if (!success) {
      toast.error('Failed to spend tokens');
      return false;
    }
    
    // Log the transaction
    await logTokenTransaction(
      userId,
      amount,
      'spend',
      'Tokens spent',
      { previous_balance: currentBalance }
    );
    
    // Update in store
    set(state => ({
      tokenControl: {
        ...state.tokenControl,
        balance: newBalance,
        queriesUsed: state.tokenControl.queriesUsed + 1,
        lastUpdated: new Date().toISOString()
      }
    }), false, { type: 'tokens/spend', amount, newBalance });
    
    logger.info('Tokens spent', { userId, amount, newBalance });
    
    return true;
  } catch (error) {
    logger.error('Failed to spend tokens', { error, amount });
    toast.error('Failed to spend tokens');
    return false;
  }
};
