
import { supabase } from '@/integrations/supabase/client';
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';
import { ChatState } from '../../../types/chat-store-types';
import { SetState, GetState } from '../types';
import { toast } from 'sonner';

export function createTokenActions(
  set: SetState<ChatState>,
  get: GetState<ChatState>
) {
  return {
    setTokenEnforcementMode: (mode: TokenEnforcementMode) => {
      set(
        state => ({
          tokenControl: {
            ...state.tokenControl,
            enforcementMode: mode
          }
        }),
        false,
        { type: 'setTokenEnforcementMode', mode }
      );
    },

    addTokens: async (amount: number): Promise<boolean> => {
      try {
        const currentBalance = get().tokenControl.balance;
        
        set(
          state => ({
            tokenControl: {
              ...state.tokenControl,
              balance: currentBalance + amount,
              lastUpdated: new Date().toISOString()
            }
          }),
          false,
          { type: 'addTokens', amount, newBalance: currentBalance + amount }
        );
        
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          await supabase.from('user_tokens').upsert({
            user_id: userData.user.id,
            balance: currentBalance + amount,
            last_updated: new Date().toISOString(),
            last_transaction: {
              type: 'add',
              amount,
              timestamp: new Date().toISOString()
            }
          }, { onConflict: 'user_id' });
        }
        
        return true;
      } catch (error) {
        console.error('Error adding tokens:', error);
        toast.error('Failed to add tokens to your account');
        return false;
      }
    },

    spendTokens: async (amount: number): Promise<boolean> => {
      try {
        const currentBalance = get().tokenControl.balance;
        
        if (currentBalance < amount) {
          toast.error(`Not enough tokens. You need ${amount} but have ${currentBalance}`);
          return false;
        }
        
        set(
          state => ({
            tokenControl: {
              ...state.tokenControl,
              balance: currentBalance - amount,
              queriesUsed: state.tokenControl.queriesUsed + 1,
              lastUpdated: new Date().toISOString()
            }
          }),
          false,
          { type: 'spendTokens', amount, newBalance: currentBalance - amount }
        );
        
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          await supabase.from('user_tokens').upsert({
            user_id: userData.user.id,
            balance: currentBalance - amount,
            last_updated: new Date().toISOString(),
            last_transaction: {
              type: 'spend',
              amount,
              timestamp: new Date().toISOString()
            },
            queries_used: get().tokenControl.queriesUsed
          }, { onConflict: 'user_id' });
        }
        
        return true;
      } catch (error) {
        console.error('Error spending tokens:', error);
        toast.error('Failed to process token transaction');
        return false;
      }
    },

    setTokenBalance: async (amount: number): Promise<boolean> => {
      try {
        set(
          state => ({
            tokenControl: {
              ...state.tokenControl,
              balance: amount,
              lastUpdated: new Date().toISOString()
            }
          }),
          false,
          { type: 'setTokenBalance', amount }
        );
        
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          await supabase.from('user_tokens').upsert({
            user_id: userData.user.id,
            balance: amount,
            last_updated: new Date().toISOString(),
            last_transaction: {
              type: 'set',
              amount,
              timestamp: new Date().toISOString()
            }
          }, { onConflict: 'user_id' });
        }
        
        return true;
      } catch (error) {
        console.error('Error setting token balance:', error);
        toast.error('Failed to update token balance');
        return false;
      }
    }
  };
}
