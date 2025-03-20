
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { TokenState, TokenStore } from './types';
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';
import { supabase } from '@/integrations/supabase/client';

const initialState: TokenState = {
  balance: 0,
  enforcementMode: 'never',
  lastUpdated: null,
  tokensPerQuery: 1,
  freeQueryLimit: 5,
  queriesUsed: 0,
  isLoading: false,
  error: null
};

export const useTokenStore = create<TokenStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setBalance: (balance) => {
          set({ 
            balance,
            lastUpdated: new Date().toISOString()
          });
        },

        setEnforcementMode: (mode) => {
          set({ enforcementMode: mode });
        },

        addTokens: async (amount) => {
          try {
            set({ isLoading: true, error: null });
            
            const currentBalance = get().balance;
            const newBalance = currentBalance + amount;
            
            // Update in database if user is logged in
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const { error } = await supabase
                .from('user_tokens')
                .upsert({ 
                  user_id: user.id,
                  balance: newBalance,
                  last_updated: new Date().toISOString()
                });
                
              if (error) throw error;
            }
            
            set({ 
              balance: newBalance,
              lastUpdated: new Date().toISOString(),
              isLoading: false
            });
            
            return true;
          } catch (error) {
            set({ 
              error: error as Error,
              isLoading: false
            });
            return false;
          }
        },

        spendTokens: async (amount) => {
          try {
            set({ isLoading: true, error: null });
            
            const currentBalance = get().balance;
            if (currentBalance < amount) {
              set({ isLoading: false });
              return false;
            }
            
            const newBalance = currentBalance - amount;
            const queriesUsed = get().queriesUsed + 1;
            
            // Update in database if user is logged in
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const { error } = await supabase
                .from('user_tokens')
                .upsert({ 
                  user_id: user.id,
                  balance: newBalance,
                  queries_used: queriesUsed,
                  last_updated: new Date().toISOString()
                });
                
              if (error) throw error;
            }
            
            set({ 
              balance: newBalance,
              queriesUsed,
              lastUpdated: new Date().toISOString(),
              isLoading: false
            });
            
            return true;
          } catch (error) {
            set({ 
              error: error as Error,
              isLoading: false
            });
            return false;
          }
        },

        resetUsage: () => {
          set({ 
            queriesUsed: 0,
            lastUpdated: new Date().toISOString()
          });
        },

        setLoading: (isLoading) => {
          set({ isLoading });
        },

        setError: (error) => {
          set({ error });
        }
      }),
      {
        name: 'token-storage',
        partialize: (state) => ({
          balance: state.balance,
          enforcementMode: state.enforcementMode,
          queriesUsed: state.queriesUsed
        })
      }
    ),
    {
      name: 'TokenStore',
      enabled: process.env.NODE_ENV !== 'production'
    }
  )
);

// Selector hooks
export const useTokenBalance = () => useTokenStore(state => state.balance);
export const useTokenEnforcementMode = () => useTokenStore(state => state.enforcementMode);
export const useTokenUsage = () => ({
  queriesUsed: useTokenStore(state => state.queriesUsed),
  freeQueryLimit: useTokenStore(state => state.freeQueryLimit),
  tokensPerQuery: useTokenStore(state => state.tokensPerQuery)
});
