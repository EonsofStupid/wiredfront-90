
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  TokenStore,
  TokenState,
  TokenActions
} from '@/types/store/features/tokens/types';
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';

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

/**
 * Store for managing token usage and enforcement
 */
export const useTokenStore = create<TokenStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Actions
      setBalance: (balance) => 
        set({ 
          balance,
          lastUpdated: new Date().toISOString()
        }),
      
      setEnforcementMode: (enforcementMode) => 
        set({ enforcementMode }),
      
      addTokens: async (amount: number): Promise<boolean> => {
        try {
          const currentBalance = get().balance;
          
          set({
            balance: currentBalance + amount,
            lastUpdated: new Date().toISOString()
          });
          
          return true;
        } catch (error) {
          set({ error: error instanceof Error ? error : new Error('Failed to add tokens') });
          return false;
        }
      },
      
      spendTokens: async (amount: number): Promise<boolean> => {
        try {
          const { balance, queriesUsed } = get();
          
          if (balance < amount) {
            return false;
          }
          
          set({
            balance: balance - amount,
            queriesUsed: queriesUsed + 1,
            lastUpdated: new Date().toISOString()
          });
          
          return true;
        } catch (error) {
          set({ error: error instanceof Error ? error : new Error('Failed to spend tokens') });
          return false;
        }
      },
      
      resetUsage: () => 
        set({
          queriesUsed: 0,
          lastUpdated: new Date().toISOString()
        }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error })
    }),
    {
      name: 'Token-Store'
    }
  )
);

// Selectors
export const useTokenBalance = () => useTokenStore((state) => state.balance);
export const useTokenEnforcementMode = () => useTokenStore((state) => state.enforcementMode);
export const useTokenUsage = () => useTokenStore((state) => ({
  queriesUsed: state.queriesUsed,
  freeQueryLimit: state.freeQueryLimit,
  tokensPerQuery: state.tokensPerQuery
}));
