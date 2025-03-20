
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { TokenStore, TokenState, TokenActions } from '@/types/store/features/tokens/types';
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';
import { logger } from '@/services/chat/LoggingService';
import { supabase } from '@/integrations/supabase/client';

// Initial state
const initialState: TokenState = {
  balance: 0,
  enforcementMode: 'never' as TokenEnforcementMode,
  lastUpdated: null,
  tokensPerQuery: 1,
  freeQueryLimit: 5,
  queriesUsed: 0,
  isLoading: false,
  error: null
};

// Create store
export const useTokenStore = create<TokenStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Basic setters
        setBalance: (balance) => set({ balance }),
        
        setEnforcementMode: (mode) => set({ 
          enforcementMode: mode,
          lastUpdated: new Date().toISOString()
        }),
        
        // Async token actions
        addTokens: async (amount) => {
          try {
            set({ isLoading: true, error: null });
            
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
              set({ 
                isLoading: false, 
                error: new Error('User not authenticated') 
              });
              return false;
            }
            
            // Call Supabase RPC function to add tokens
            const { data, error } = await supabase.rpc('add_tokens', {
              user_id_input: user.id,
              amount_input: amount
            });
            
            if (error) throw error;
            
            // Update local state with new balance
            if (data) {
              set({ 
                balance: data.new_balance,
                lastUpdated: new Date().toISOString(),
                isLoading: false
              });
              logger.info('Tokens added', { amount, newBalance: data.new_balance });
              return true;
            }
            
            set({ isLoading: false });
            return false;
          } catch (error) {
            logger.error('Error adding tokens', { error, amount });
            set({ 
              isLoading: false, 
              error: error as Error
            });
            return false;
          }
        },
        
        spendTokens: async (amount) => {
          try {
            set({ isLoading: true, error: null });
            
            // Don't allow spending more tokens than available
            const currentBalance = get().balance;
            if (currentBalance < amount) {
              set({ 
                isLoading: false, 
                error: new Error('Insufficient token balance') 
              });
              return false;
            }
            
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
              set({ 
                isLoading: false, 
                error: new Error('User not authenticated') 
              });
              return false;
            }
            
            // Call Supabase RPC function to spend tokens
            const { data, error } = await supabase.rpc('spend_tokens', {
              user_id_input: user.id,
              amount_input: amount
            });
            
            if (error) throw error;
            
            // Update local state with new balance
            if (data) {
              set({ 
                balance: data.new_balance,
                queriesUsed: get().queriesUsed + 1,
                lastUpdated: new Date().toISOString(),
                isLoading: false
              });
              logger.info('Tokens spent', { 
                amount, 
                newBalance: data.new_balance,
                queriesUsed: get().queriesUsed
              });
              return true;
            }
            
            set({ isLoading: false });
            return false;
          } catch (error) {
            logger.error('Error spending tokens', { error, amount });
            set({ 
              isLoading: false, 
              error: error as Error
            });
            return false;
          }
        },
        
        resetUsage: () => {
          set({ 
            queriesUsed: 0,
            lastUpdated: new Date().toISOString()
          });
          logger.info('Token usage reset');
        },
        
        setLoading: (isLoading) => set({ isLoading }),
        
        setError: (error) => set({ error })
      }),
      {
        name: 'token-storage',
        partialize: (state) => ({
          balance: state.balance,
          enforcementMode: state.enforcementMode,
          queriesUsed: state.queriesUsed,
          tokensPerQuery: state.tokensPerQuery,
          freeQueryLimit: state.freeQueryLimit,
        })
      }
    ),
    {
      name: 'TokenStore',
      enabled: process.env.NODE_ENV !== 'production'
    }
  )
);

// Selector hooks for more focused state access
export const useTokenBalance = () => useTokenStore(state => state.balance);
export const useTokenEnforcementMode = () => useTokenStore(state => state.enforcementMode);
export const useTokenUsage = () => {
  const { queriesUsed, freeQueryLimit, tokensPerQuery, balance } = useTokenStore();
  return {
    queriesUsed,
    freeQueryLimit,
    tokensPerQuery,
    balance,
    hasReachedFreeLimit: queriesUsed >= freeQueryLimit,
    hasSufficientTokens: balance >= tokensPerQuery
  };
};
