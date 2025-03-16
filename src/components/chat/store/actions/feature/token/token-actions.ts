
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { ChatState } from '../../../types/chat-store-types';
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';
import { FeatureActions, SetState, GetState } from '../types';
import { updateUserTokens, logTokenTransaction } from './token-utils';
import { addTokensAction } from './token-management';
import { spendTokensAction } from './token-spending';
import { setTokenBalanceAction } from './token-balance';

/**
 * Creates all token-related actions for the chat store
 */
export const createTokenActions = (
  set: SetState<ChatState>, 
  get: GetState<ChatState>
): Pick<FeatureActions, 'setTokenEnforcementMode' | 'addTokens' | 'spendTokens' | 'setTokenBalance'> => ({
  setTokenEnforcementMode: (mode: TokenEnforcementMode) =>
    set(
      (state: ChatState) => ({
        ...state,
        tokenControl: {
          ...state.tokenControl,
          enforcementMode: mode
        }
      }),
      false,
      { type: 'tokens/setEnforcementMode', mode }
    ),
  
  addTokens: (amount: number) => addTokensAction(amount, set, get),
  spendTokens: (amount: number) => spendTokensAction(amount, set, get),
  setTokenBalance: (amount: number) => setTokenBalanceAction(amount, set, get)
});
