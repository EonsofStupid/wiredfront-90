
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { ChatState } from '../../../types/chat-store-types';
import { SetState, GetState } from '../types';
import { updateUserTokens } from './token-utils';
import { toast } from 'sonner';

/**
 * Action to set a user's token balance directly
 */
export const setTokenBalanceAction = async (
  amount: number,
  set: SetState<ChatState>,
  get: GetState<ChatState>
): Promise<boolean> => {
  try {
    // Get the current auth user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      toast.error('You must be logged in to set token balance');
      return false;
    }
    
    const userId = userData.user.id;
    
    // Update in database
    const success = await updateUserTokens(userId, amount);
    if (!success) {
      toast.error('Failed to set token balance');
      return false;
    }
    
    // Update in store
    set(state => ({
      tokenControl: {
        ...state.tokenControl,
        balance: amount,
        lastUpdated: new Date().toISOString()
      }
    }), false, { type: 'tokens/set', amount });
    
    logger.info('Token balance set', { userId, amount });
    
    return true;
  } catch (error) {
    logger.error('Failed to set token balance', { error, amount });
    toast.error('Failed to set token balance');
    return false;
  }
};
